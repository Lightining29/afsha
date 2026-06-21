import express from 'express';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { getFinalPrice } from '../utils/pricing.js';
import { sendOrderReceipt } from '../services/email.js';
import { verifyOrderSignature, verifyWebhookSignature } from '../utils/razorpaySignature.js';

const router = express.Router();

// Single Razorpay client. If keys are missing, endpoints fail loudly (no silent demo).
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/**
 * Fulfill an order: decrement stock and send the receipt email.
 * Idempotent — safe to call from both /verify and /webhook.
 */
export async function fulfillOrder(order) {
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
      product.inStock = product.stockQuantity > 0;
      await product.save();
    }
  }
  if (!order.receiptSent) {
    await sendOrderReceipt(order, order.shippingAddress?.email);
    order.receiptSent = true;
    await order.save();
  }
}

/** Razorpay webhook — raw body registered in index.js. Idempotent safety net. */
export async function razorpayWebhookHandler(req, res) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const rawBody = req.body?.toString?.() || '';
  const signature = req.headers['x-razorpay-signature'];

  if (!secret || !verifyWebhookSignature(rawBody, signature, secret)) {
    return res.status(400).send('Invalid signature');
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      const order = payment?.order_id
        ? await Order.findOne({ razorpayOrderId: payment.order_id })
        : null;
      if (order && order.status === 'pending_payment') {
        order.status = 'paid';
        order.razorpayPaymentId = payment.id;
        await order.save();
        await fulfillOrder(order);
      }
    }
  } catch (err) {
    console.error('Razorpay webhook error:', err.message);
  }

  // Always 200 so Razorpay doesn't retry on our internal errors.
  return res.json({ received: true });
}

// Create order + Razorpay order, then return the payload the Checkout modal needs.
router.post('/checkout', protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ message: 'Razorpay not configured' });
    }

    const { items, shippingAddress } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Cart is empty' });
    if (!shippingAddress?.fullName || !shippingAddress?.email || !shippingAddress?.address) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId || item._id);
      if (!product) return res.status(400).json({ message: `Product not found: ${item.name || item.productId}` });
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      const price = getFinalPrice(product);
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price,
        quantity: item.quantity,
      });
      subtotal += price * item.quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal,
      total: subtotal,
      shippingAddress,
      status: 'pending_payment',
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order._id.toString() },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify the Checkout modal's response and fulfill. Primary fulfiller.
router.post('/verify/:orderId', protect, async (req, res) => {
  try {
    const { razorpayPaymentId, razorpaySignature } = req.body;
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.razorpayOrderId) return res.status(400).json({ message: 'Order has no Razorpay session' });

    const valid = verifyOrderSignature(
      { razorpayOrderId: order.razorpayOrderId, razorpayPaymentId, signature: razorpaySignature },
      process.env.RAZORPAY_KEY_SECRET
    );
    if (!valid) return res.status(400).json({ message: 'Invalid signature' });

    // Idempotency — if webhook already fulfilled, don't double-process.
    if (order.status !== 'pending_payment') {
      return res.json({ ok: true, alreadyPaid: true });
    }

    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (payment.status !== 'captured') {
      return res.status(402).json({ message: 'Payment not captured' });
    }

    order.status = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();
    await fulfillOrder(order);

    return res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
