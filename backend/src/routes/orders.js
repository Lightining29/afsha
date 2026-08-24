import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { getFinalPrice, calculateItemTotal, getBogoPayableQuantity, isBogoActive } from '../utils/pricing.js';
import { sendOrderReceipt } from '../services/email.js';
import { verifyOrderSignature, verifyWebhookSignature } from '../utils/razorpaySignature.js';

const router = express.Router();

// Single Razorpay client. If keys are missing, endpoints fail loudly (no silent demo).
let razorpay = null;
function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim()?.replace(/^["']|["']$/g, '');
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim()?.replace(/^["']|["']$/g, '');
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

function getProductId(product) {
  if (!product) return '';
  if (typeof product === 'string') return product;
  if (product._id) return product._id.toString();
  if (product.toString) return product.toString();
  return '';
}

function getProductImageUrl(product) {
  const productId = getProductId(product);
  if (!productId) return '';
  const version = product.updatedAt ? `?v=${product.updatedAt.getTime()}` : '';
  return `/api/images/product/${productId}${version}`;
}

function withItemImageFallback(order) {
  const obj = order.toObject();
  obj.items = (obj.items || []).map((item) => ({
    ...item,
    image: item.image || getProductImageUrl(item.product),
  }));
  return obj;
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
      product.salesCount = (product.salesCount || 0) + item.quantity;
      await product.save();
    }
  }
  if (!order.receiptSent) {
    await sendOrderReceipt(order, order.shippingAddress?.email);
    order.receiptSent = true;
    await order.save();
  }
}

async function sendReceiptIfNeeded(order) {
  if (!order.receiptSent) {
    await sendOrderReceipt(order, order.shippingAddress?.email);
    order.receiptSent = true;
    await order.save();
  }
}

function hasConfirmedPayment(order) {
  return ['paid', 'approved', 'shipped'].includes(order.status);
}

function checkoutToken(userId, amount, items) {
  const itemKey = items
    .map((item) => `${item.productId || item._id}:${Number(item.quantity)}`)
    .sort()
    .join(',');
  return crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET.trim())
    .update(`${userId}|${amount}|${itemKey}`)
    .digest('hex');
}

function safeTokenEquals(actual, expected) {
  if (!actual || !expected) return false;
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
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
      } else if (order && hasConfirmedPayment(order)) {
        await sendReceiptIfNeeded(order);
      }
    }
  } catch (err) {
    console.error('Razorpay webhook error:', err.message);
  }

  // Always 200 so Razorpay doesn't retry on our internal errors.
  return res.json({ received: true });
}

// Create only the Razorpay payment session. A database order is created after the
// payment has been verified, so abandoned checkout attempts are never stored.
router.post('/checkout', protect, async (req, res) => {
  try {
    const rzp = getRazorpay();
    if (!rzp) {
      return res.status(500).json({ message: 'Razorpay API credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) not configured on Render environment.' });
    }

    const { items, shippingAddress } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Cart is empty' });
    if (!shippingAddress?.fullName || !shippingAddress?.email || !shippingAddress?.address) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    let subtotal = 0;
    const paymentItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item._id);
      if (!product) return res.status(400).json({ message: `Product not found: ${item.name || item.productId}` });
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      const itemTotal = calculateItemTotal(product, item.quantity);
      subtotal += itemTotal;
      paymentItems.push({ productId: product._id.toString(), quantity: item.quantity });
    }

    const amount = Math.round(subtotal * 100);
    const token = checkoutToken(req.user.id, amount, paymentItems);

    const razorpayOrder = await rzp.orders.create({
      amount, // paise
      currency: 'INR',
      receipt: `afsha_${Date.now()}`,
      notes: { checkoutToken: token },
    });

    return res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID?.trim()?.replace(/^["']|["']$/g, ''),
    });
  } catch (err) {
    console.error('Checkout error:', err);
    const errorMsg = err?.error?.description || err?.message || 'Razorpay checkout failed';
    res.status(500).json({ message: errorMsg });
  }
});

// Verify the Checkout modal response, then create and fulfill the database order.
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, items, shippingAddress } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }
    if (!items?.length || !shippingAddress?.fullName || !shippingAddress?.email || !shippingAddress?.address) {
      return res.status(400).json({ message: 'Order details are required' });
    }

    const valid = verifyOrderSignature(
      { razorpayOrderId, razorpayPaymentId, signature: razorpaySignature },
      process.env.RAZORPAY_KEY_SECRET
    );
    if (!valid) return res.status(400).json({ message: 'Invalid signature' });

    const existingOrder = await Order.findOne({ razorpayPaymentId });
    if (existingOrder) return res.json({ ok: true, orderId: existingOrder._id, alreadyPaid: true });

    const rzp = getRazorpay();
    if (!rzp) {
      return res.status(500).json({ message: 'Razorpay not configured' });
    }
    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const quantity = Number(item.quantity);
      const product = await Product.findById(item.productId || item._id);
      if (!product || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Invalid order item' });
      }
      if (product.stockQuantity < quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      const price = getFinalPrice(product);
      const itemTotal = calculateItemTotal(product, quantity);
      orderItems.push({ product: product._id, name: product.name, image: getProductImageUrl(product), price, quantity });
      subtotal += itemTotal;
    }

    const amount = Math.round(subtotal * 100);
    const expectedToken = checkoutToken(req.user.id, amount, items);
    const razorpayOrder = await rzp.orders.fetch(razorpayOrderId);
    if (!safeTokenEquals(razorpayOrder.notes?.checkoutToken, expectedToken)) {
      return res.status(400).json({ message: 'Checkout session does not match this order' });
    }

    const payment = await rzp.payments.fetch(razorpayPaymentId);
    if (payment.status !== 'captured' || payment.order_id !== razorpayOrderId) {
      return res.status(402).json({ message: 'Payment not captured' });
    }
    if (amount !== payment.amount) {
      return res.status(400).json({ message: 'Payment amount does not match the current order total' });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal,
      total: subtotal,
      shippingAddress,
      status: 'paid',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    await fulfillOrder(order);

    return res.json({ ok: true, orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id, status: { $ne: 'pending_payment' } })
      .populate('items.product', 'updatedAt')
      .sort({ createdAt: -1 });
    res.json(orders.map(withItemImageFallback));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
      .populate('items.product', 'updatedAt');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(withItemImageFallback(order));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
