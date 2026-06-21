# Razorpay UPI Payments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all existing payment methods (Stripe cards + fake demo UPI) with a real, webhook-verified Razorpay UPI flow via Razorpay Standard Checkout.

**Architecture:** Backend creates a Razorpay order on checkout; the frontend opens the Razorpay Standard Checkout modal (UPI only). On modal success the frontend calls a `/verify` endpoint that checks the HMAC signature and fulfills the order; a Razorpay webhook (`/webhook`) serves as an idempotent safety net. The Order model, `fulfillOrder()`, and `sendOrderReceipt()` are reused.

**Tech Stack:** Node.js + Express + MongoDB (backend), React + Vite (frontend), `razorpay` npm SDK, Razorpay Standard Checkout JS, HMAC-SHA256 signature verification via Node `crypto`.

**Spec:** `docs/superpowers/specs/2026-06-21-razorpay-upi-payments-design.md`

---

## File Structure

**Backend (modified):**
- `backend/package.json` — swap `stripe` → `razorpay`
- `backend/.env.example` — replace Stripe vars with Razorpay vars
- `backend/src/models/Order.js` — replace Stripe fields with Razorpay fields, narrow `paymentMethod` enum
- `backend/src/routes/orders.js` — inline rewrite: Razorpay order creation, `/verify`, `/webhook`; remove Stripe + demo-pay
- `backend/src/index.js` — rename webhook handler import

**Backend (new):**
- `backend/test/signature.test.js` — unit test for HMAC verification helper
- `backend/src/utils/razorpaySignature.js` — exported HMAC verification helper (testable)

**Frontend (modified):**
- `frontend/index.html` — add Razorpay checkout script tag
- `frontend/package.json` — remove unused `html5-qrcode`, `qrcode` deps
- `frontend/src/api/index.js` — replace `demoPay` with `verifyPayment`
- `frontend/src/pages/shop/Checkout.jsx` — replace demo UI with Razorpay modal flow
- `frontend/src/pages/shop/CheckoutSuccess.jsx` — simplify to confirmation screen
- `frontend/src/pages/shop/Checkout.css` — remove demo/scanner styles, keep checkout + success base styles

---

## Task 1: Backend — Order model migration

**Files:**
- Modify: `backend/src/models/Order.js`

- [ ] **Step 1: Update Order model**

Replace lines 27-29 (the `paymentMethod` + Stripe fields) in `backend/src/models/Order.js`. The current block is:

```js
    paymentMethod: { type: String, enum: ['stripe', 'demo'], default: 'stripe' },
    stripeSessionId: String,
    stripePaymentIntentId: String,
```

Replace with:

```js
    paymentMethod: { type: String, enum: ['razorpay'], default: 'razorpay' },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: String,
    razorpaySignature: String,
```

- [ ] **Step 2: Verify model loads**

Run: `node -e "import('./backend/src/models/Order.js').then(m => console.log('OK', m.default.modelName))"`
Expected: prints `OK Order` with no errors.

- [ ] **Step 3: Commit**

```bash
git add backend/src/models/Order.js
git commit -m "feat(orders): migrate Order model from Stripe to Razorpay fields"
```

---

## Task 2: Backend — Signature verification helper (TDD)

This helper isolates HMAC logic so it can be unit-tested without Razorpay or MongoDB.

**Files:**
- Create: `backend/src/utils/razorpaySignature.js`
- Create: `backend/test/signature.test.js`

- [ ] **Step 1: Set up a minimal test runner**

This project has no test framework yet. Install Node's built-in test runner (Node 18+). Add a test script to `backend/package.json`. First read the current scripts block:

Current `backend/package.json` scripts:
```json
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "seed": "node src/seed.js"
  },
```

Add a `test` script:
```json
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "seed": "node src/seed.js",
    "test": "node --test"
  },
```

- [ ] **Step 2: Write the failing test**

Create `backend/test/signature.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyOrderSignature, verifyWebhookSignature } from '../src/utils/razorpaySignature.js';

const SECRET = 'test-secret';

test('verifyOrderSignature accepts a correct HMAC', () => {
  const razorpayOrderId = 'order_abc';
  const razorpayPaymentId = 'pay_xyz';
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  assert.equal(
    verifyOrderSignature({ razorpayOrderId, razorpayPaymentId, signature }, SECRET),
    true
  );
});

test('verifyOrderSignature rejects a wrong HMAC', () => {
  assert.equal(
    verifyOrderSignature({
      razorpayOrderId: 'order_abc',
      razorpayPaymentId: 'pay_xyz',
      signature: 'deadbeef',
    }, SECRET),
    false
  );
});

test('verifyWebhookSignature accepts a correct HMAC over the raw body', () => {
  const body = JSON.stringify({ event: 'payment.captured' });
  const signature = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
  assert.equal(verifyWebhookSignature(body, signature, SECRET), true);
});

test('verifyWebhookSignature rejects a tampered body', () => {
  const body = JSON.stringify({ event: 'payment.captured' });
  const signature = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
  assert.equal(verifyWebhookSignature(body + '!', signature, SECRET), false);
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd backend && node --test`
Expected: FAIL — `Cannot find module .../razorpaySignature.js`

- [ ] **Step 4: Write the helper**

Create `backend/src/utils/razorpaySignature.js`:

```js
import crypto from 'crypto';

/**
 * Verify the signature returned by Razorpay Checkout on the client.
 * Razorpay signs `razorpayOrderId|razorpayPaymentId` with the key secret.
 * Uses timingSafeEqual to avoid timing leaks.
 */
export function verifyOrderSignature({ razorpayOrderId, razorpayPaymentId, signature }, secret) {
  if (!razorpayOrderId || !razorpayPaymentId || !signature || !secret) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Verify the signature on an incoming Razorpay webhook.
 * Razorpay signs the entire raw request body with the webhook secret.
 */
export function verifyWebhookSignature(rawBody, signature, secret) {
  if (!rawBody || !signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd backend && node --test`
Expected: 4 tests PASS, 0 fail.

- [ ] **Step 6: Commit**

```bash
git add backend/package.json backend/test/signature.test.js backend/src/utils/razorpaySignature.js
git commit -m "feat(razorpay): add HMAC signature verification helper with tests"
```

---

## Task 3: Backend — Rewrite orders routes

This is the core backend change. Removes Stripe + demo-pay; adds Razorpay order creation, `/verify`, and `/webhook`.

**Files:**
- Modify: `backend/src/routes/orders.js`

- [ ] **Step 1: Install the Razorpay SDK**

Run: `cd backend && npm install razorpay@^2.9.4 && npm uninstall stripe`

- [ ] **Step 2: Rewrite the routes file**

Replace the entire contents of `backend/src/routes/orders.js` with:

```js
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
```

- [ ] **Step 3: Update index.js webhook registration**

In `backend/src/index.js`, replace the import and the webhook route. Change:

```js
import orderRoutes, { stripeWebhookHandler } from './routes/orders.js';
```

to:

```js
import orderRoutes, { razorpayWebhookHandler } from './routes/orders.js';
```

And change:

```js
app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);
```

to:

```js
app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), razorpayWebhookHandler);
```

- [ ] **Step 4: Verify the server boots**

Run: `cd backend && node src/index.js` (then Ctrl-C after you see the listen log, or it errors)
Expected: prints `Server running on http://localhost:5000` (or a DB connection error, which is fine — we only need it to parse). No `Cannot find module 'stripe'` or import errors.

- [ ] **Step 5: Verify the signature tests still pass**

Run: `cd backend && node --test`
Expected: 4 PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/src/routes/orders.js backend/src/index.js backend/package.json backend/package-lock.json
git commit -m "feat(razorpay): replace Stripe + demo with Razorpay UPI checkout, verify, webhook"
```

---

## Task 4: Backend — Update env example

**Files:**
- Modify: `backend/.env.example`

- [ ] **Step 1: Replace Stripe env vars**

In `backend/.env.example`, replace:

```
# Stripe (optional — demo payment used if not set)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

with:

```
# Razorpay (required — checkout fails if missing)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

Also update `backend/.env` (the live one) with the same Razorpay keys block so the server starts configured. Leave values empty for now — the user fills them in.

- [ ] **Step 2: Commit**

```bash
git add backend/.env.example
git commit -m "chore(env): document Razorpay env vars"
```

---

## Task 5: Frontend — Add Razorpay script + swap API helper

**Files:**
- Modify: `frontend/index.html`
- Modify: `frontend/src/api/index.js`

- [ ] **Step 1: Add Razorpay checkout script to index.html**

In `frontend/index.html`, inside `<head>`, after the Google Fonts `<link>` (line 10), add:

```html
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

- [ ] **Step 2: Swap demoPay for verifyPayment**

In `frontend/src/api/index.js`, replace:

```js
export async function demoPay(orderId) {
  return apiFetch(`/orders/demo-pay/${orderId}`, { method: 'POST' });
}
```

with:

```js
export async function verifyPayment(orderId, { razorpayPaymentId, razorpaySignature }) {
  return apiFetch(`/orders/verify/${orderId}`, {
    method: 'POST',
    body: JSON.stringify({ razorpayPaymentId, razorpaySignature }),
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/index.html frontend/src/api/index.js
git commit -m "feat(frontend): load Razorpay checkout script, add verifyPayment API helper"
```

---

## Task 6: Frontend — Rewrite Checkout page

**Files:**
- Modify: `frontend/src/pages/shop/Checkout.jsx`

- [ ] **Step 1: Rewrite Checkout.jsx**

Replace the entire contents of `frontend/src/pages/shop/Checkout.jsx` with:

```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkout, verifyPayment, formatPrice, getProductPrice } from '../../api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './Checkout.css';
import '../auth/Auth.css';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="success-page">
          <div className="success-card">
            <h1>Cart is empty</h1>
            <Link to="/" className="btn btn-sky">Continue Shopping</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const openRazorpay = (result) => {
    const rzp = new window.Razorpay({
      key: result.key,
      amount: result.amount,
      currency: result.currency,
      name: 'Glowora',
      description: `Order ${result.orderId}`,
      order_id: result.razorpayOrderId,
      prefill: { name: form.fullName, email: form.email, contact: form.phone },
      method: { upi: true, card: false, netbanking: false, wallet: false },
      config: {
        display: {
          blocks: {
            upi: {
              name: 'Pay via UPI',
              instruments: [{ method: 'upi', flows: ['intent', 'collect'] }],
            },
          },
        },
      },
      handler: async (response) => {
        try {
          await verifyPayment(result.orderId, {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          clearCart();
          navigate(`/checkout/success?orderId=${result.orderId}`);
        } catch (err) {
          setError(err.message || 'Payment verification failed.');
          setLoading(false);
        }
      },
      modal: { ondismiss: () => setLoading(false) },
    });

    rzp.on('payment.failed', (resp) => {
      setError(resp?.error?.description || 'Payment failed.');
      setLoading(false);
    });

    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = items.map((i) => ({
        productId: i._id,
        quantity: i.quantity,
      }));
      const result = await checkout(payload, form);
      openRazorpay(result);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <div className="container">
          <Link to="/cart" className="back-link">
            <ArrowLeft size={18} /> Back to Cart
          </Link>
          <h1 className="checkout-title">Checkout</h1>

          <div className="checkout-layout">
            <form className="checkout-form-card" onSubmit={handleSubmit}>
              <h3>Shipping Information</h3>
              {error && <div className="auth-error">{error}</div>}
              <div className="demo-pay-notice">
                <CreditCard size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Pay via UPI through Razorpay. On mobile this opens GPay, PhonePe, BHIM or your UPI app; on desktop it shows a UPI QR code.
              </div>
              <div className="checkout-grid">
                <div className="form-group full">
                  <label>Full Name</label>
                  <input value={form.fullName} onChange={update('fullName')} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={update('email')} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={update('phone')} />
                </div>
                <div className="form-group full">
                  <label>Address</label>
                  <input value={form.address} onChange={update('address')} required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input value={form.city} onChange={update('city')} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input value={form.state} onChange={update('state')} />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input value={form.zip} onChange={update('zip')} required />
                </div>
              </div>
              <button type="submit" className="btn btn-sky" style={{ width: '100%', marginTop: 24, justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Processing...' : `Pay ${formatPrice(cartTotal)}`}
              </button>
            </form>

            <div className="checkout-summary">
              <h3>Order Summary</h3>
              {items.map((item) => (
                <div key={item._id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item-info">
                    <h4>{item.name}</h4>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <span>{formatPrice(getProductPrice(item) * item.quantity)}</span>
                </div>
              ))}
              <div className="summary-divider" style={{ margin: '16px 0', borderTop: '2px solid var(--border)' }} />
              <div className="summary-row total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/shop/Checkout.jsx
git commit -m "feat(checkout): replace demo UPI with Razorpay Standard Checkout modal"
```

---

## Task 7: Frontend — Simplify CheckoutSuccess page

**Files:**
- Modify: `frontend/src/pages/shop/CheckoutSuccess.jsx`

- [ ] **Step 1: Rewrite CheckoutSuccess.jsx**

Replace the entire contents of `frontend/src/pages/shop/CheckoutSuccess.jsx` with:

```jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { fetchOrder, formatPrice } from '../../api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './Checkout.css';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
        .then(setOrder)
        .catch(() => {});
    }
  }, [orderId]);

  return (
    <>
      <Navbar />
      <div className="success-page">
        <div className="success-card success-stack">
          <div className="success-header">
            <div className="success-icon">
              <CheckCircle size={36} />
            </div>
            <div>
              <h1>Payment Successful!</h1>
              <p>Thank you for your order. Your payment has been verified and the order is saved.</p>
            </div>
          </div>

          {order && (
            <div className="success-meta-grid">
              <div className="success-meta-box">
                <strong>Order</strong>
                <span>{order.orderNumber}</span>
              </div>
              <div className="success-meta-box">
                <strong>Total</strong>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="success-meta-box">
                <strong>Status</strong>
                <span>{order.status}</span>
              </div>
            </div>
          )}

          <p style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Mail size={16} /> A receipt has been sent to your email, and the order record is saved in MongoDB.
          </p>
          <div className="success-actions">
            <Link to="/account" className="btn btn-sky">View Order History</Link>
            <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/shop/CheckoutSuccess.jsx
git commit -m "feat(checkout): simplify success page to confirmation screen"
```

---

## Task 8: Frontend — Remove unused deps + clean CSS

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/src/pages/shop/Checkout.css`

- [ ] **Step 1: Remove unused frontend deps**

Run: `cd frontend && npm uninstall html5-qrcode qrcode`

- [ ] **Step 2: Remove demo/scanner CSS**

In `frontend/src/pages/shop/Checkout.css`, delete the following rule blocks (they're now unused — only the demo QR/scanner UI used them):
- `.paytm-panel`
- `.paytm-card, .paytm-scanner-wrap`
- `.paytm-card`
- `.paytm-card h4`
- `.paytm-card p, .paytm-message`
- `.paytm-qr-image`
- `.paytm-qr-placeholder`
- `.paytm-scanner-box`
- `.success-grid`
- `.success-panel h2`
- `.success-panel p`
- `.qr-preview`
- `.qr-placeholder`
- `.scanner-shell`
- `.scan-message, .tiny-note`
- `.scan-result-card`
- `.scan-result-card strong`
- `.scan-result-card span, .scan-result-card small`

Keep: `.checkout-page`, `.checkout-title`, `.checkout-layout`, `.checkout-form-card, .checkout-summary`, headings, `.checkout-grid`, `.full`, `.checkout-item*`, `.demo-pay-notice` (reused for the Razorpay notice), `.success-page`, `.success-card`, `.success-stack`, `.success-header`, `.success-meta-grid`, `.success-meta-box, .panel-label`, `.success-icon`, `.success-card h1`, `.success-card p`, `.success-actions`, and both `@media` blocks.

Also remove `.success-grid` from the `@media (max-width: 980px)` rule since `.success-grid` no longer exists. That rule should become:

```css
@media (max-width: 980px) {
  .success-meta-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Verify the build still works**

Run: `cd frontend && npm run build`
Expected: build completes, no errors about missing `html5-qrcode`/`qrcode` or undefined CSS.

- [ ] **Step 4: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/pages/shop/Checkout.css
git commit -m "chore(frontend): remove unused qrcode deps and demo/scanner CSS"
```

---

## Task 9: End-to-end smoke test

This task verifies the whole thing hangs together. No real money — uses Razorpay test mode.

**Files:** none (verification only)

- [ ] **Step 1: Boot backend with test keys**

Add test keys to `backend/.env`:
```
RAZORPAY_KEY_ID=rzp_test_<your_test_key_id>
RAZORPAY_KEY_SECRET=<your_test_key_secret>
RAZORPAY_WEBHOOK_SECRET=<set_after_registering_webhook>
```

Run: `cd backend && npm start`
Expected: `Server running on http://localhost:5000` + DB connected.

- [ ] **Step 2: Verify checkout returns a Razorpay order**

Run (replace token):
```bash
curl -X POST http://localhost:5000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_JWT>" \
  -d '{"items":[{"productId":"<PRODUCT_ID>","quantity":1}],"shippingAddress":{"fullName":"Test","email":"t@t.com","address":"1 St"}}'
```
Expected: `200` with `{ orderId, razorpayOrderId: "order_...", amount, currency: "INR", key: "rzp_test_..." }`.

- [ ] **Step 3: Verify unconfigured rejection**

Temporarily unset `RAZORPAY_KEY_ID`, restart, hit `/checkout`.
Expected: `500 { message: "Razorpay not configured" }`.

- [ ] **Step 4: Frontend smoke**

Run: `cd frontend && npm run dev`
- Open checkout, fill form, click Pay.
- Confirm Razorpay modal opens with UPI as the only method (GPay/PhonePe/BHIM, QR on desktop).
- In test mode, complete a UPI test payment (Razorpay test UPI ID, e.g. `success@razorpay`).
- Confirm: redirect to `/checkout/success`, order shows `paid`, stock decremented in DB, receipt logged to console (no SMTP configured).

- [ ] **Step 5: Webhook smoke (optional, dashboard)**

In Razorpay dashboard → Webhooks → register `https://<tunnel>/api/orders/webhook` for `payment.captured`, copy secret into `RAZORPAY_WEBHOOK_SECRET`, restart. Use "Send Test Webhook". Confirm the order (if still pending) flips to `paid` and there's no double fulfillment (check `receiptSent` + stock decremented only once).

---

## Self-Review

**Spec coverage:**
- ✅ Razorpay only, no demo fallback — Task 3 `/checkout` returns 500 if unconfigured
- ✅ Verify primary + webhook safety net, both idempotent — Task 3, guarded on `status === 'pending_payment'`
- ✅ Amount in paise, INR — Task 3 `Math.round(order.total * 100)`
- ✅ `fulfillOrder` reused — Task 3
- ✅ `sendOrderReceipt` reused — unchanged, called via `fulfillOrder`
- ✅ Order model field swap — Task 1
- ✅ Stripe removed from package.json — Task 3 Step 1
- ✅ .env.example updated — Task 4
- ✅ index.html Razorpay script — Task 5
- ✅ Checkout.jsx Razorpay modal — Task 6
- ✅ CheckoutSuccess simplified — Task 7
- ✅ Unused deps removed — Task 8
- ✅ Signature verification tested — Task 2
- ✅ Admin routes untouched — confirmed in exploration (only touch `status`)

**Placeholder scan:** None. Every step has concrete code or exact commands.

**Type/name consistency:** `razorpayWebhookHandler`, `verifyOrderSignature`, `verifyWebhookSignature`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`, `verifyPayment` — all consistent across model, routes, API client, and Checkout. `fulfillOrder` signature unchanged.
