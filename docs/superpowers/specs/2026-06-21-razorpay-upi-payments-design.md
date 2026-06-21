# Razorpay UPI Payments — Design Spec

**Date:** 2026-06-21
**Status:** Approved
**Scope:** Replace all existing payment methods (Stripe cards + fake demo UPI) with a real, webhook-verified Razorpay UPI flow (GPay/PhonePe/BHIM via Razorpay Standard Checkout).

## Goal

When a customer buys, they pay via UPI through Razorpay. On payment success, Razorpay calls a Node.js webhook; the backend updates MongoDB and emails a receipt. The fake "demo" QR-scanner payment (which never moved real money) is removed entirely.

## Non-Goals

- Keeping Stripe or the demo payment mode as a fallback.
- Cards / netbanking / wallets — UPI only.
- Subscriptions, refunds, or a separate `Payment` collection.
- Admin-facing payment changes (admin still only approves/ships `paid` orders).

## Architecture & Data Flow

```
Frontend (Checkout.jsx)
  1. Customer fills shipping form, clicks "Pay ₹X"
  2. POST /api/orders/checkout  → { orderId, razorpayOrderId, amount, currency, key }
  3. Razorpay Standard Checkout modal opens (UPI: GPay/PhonePe/BHIM, intent + QR)
  4. On modal success → POST /api/orders/verify/:orderId
  5. Navigate to /checkout/success

Backend (routes/orders.js)
  /checkout       create Order (pending_payment) + razorpay.orders.create()
  /verify/:id     verify HMAC signature + fetch payment → mark paid + fulfill
  /webhook        raw body, verify webhook sig → idempotent fulfill (safety net)

MongoDB
  Order.status: pending_payment → paid
  Order.paymentMethod: 'razorpay'
  Order.razorpayOrderId / razorpayPaymentId
  Order.receiptSent: true
  Product.stockQuantity decremented (via existing fulfillOrder)

Email — sendOrderReceipt() (existing, reused)
```

## Design Decisions

1. **Razorpay is the only payment method.** No demo fallback. If `RAZORPAY_KEY_ID` is missing, `/checkout` returns a clear 500 ("Razorpay not configured") rather than silently demoing.
2. **Verify endpoint is the primary fulfiller; webhook is the safety net.** Both are idempotent — guarded by `status === 'pending_payment'`. Whichever arrives first fulfills; the other is a no-op. This prevents double stock-decrement or double email.
3. **Amount in paise, INR only.** Matches the app's ₹ pricing. `amount = Math.round(order.total * 100)`.
4. **`fulfillOrder()` reused unchanged.** It already decrements stock (`Math.max(0, ...)`) and sends the receipt (idempotent via `receiptSent`).
5. **Existing receipt email (`sendOrderReceipt`) reused unchanged.** Sends within ~1s of modal closing.
6. **CheckoutSuccess simplified.** The page's "Purchase QR / Live Scanner" demo-verification UI is removed; it becomes a clean order-confirmation screen.

## Backend Changes

### Dependencies — `backend/package.json`
- Remove `stripe`.
- Add `razorpay` (`^2.9.4`).
- `crypto` is Node built-in (no install).

### Environment — `backend/.env.example`
Replace Stripe vars:
```
# Razorpay (required — checkout fails if missing)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

### Order model — `backend/src/models/Order.js`
```diff
-   paymentMethod: { type: String, enum: ['stripe', 'demo'], default: 'stripe' },
+   paymentMethod: { type: String, enum: ['razorpay'], default: 'razorpay' },
-   stripeSessionId: String,
-   stripePaymentIntentId: String,
+   razorpayOrderId: { type: String, index: true },
+   razorpayPaymentId: String,
+   razorpaySignature: String,
```

### `backend/src/routes/orders.js` — inline rewrite (Approach A)
- Remove `import Stripe from 'stripe'`. Add `import Razorpay from 'razorpay'` and `import crypto from 'crypto'`.
- Instantiate one `razorpay` client at module load.
- **`POST /checkout`** — validate cart/stock (unchanged), create `Order` (`status: 'pending_payment'`), call `razorpay.orders.create({ amount, currency:'INR', receipt, notes })`, store `razorpayOrderId`, return `{ orderId, razorpayOrderId, amount, currency, key }`.
- **`POST /verify/:orderId`** (`protect`) — HMAC-SHA256 verify of `${razorpayOrderId}|${razorpayPaymentId}` against `RAZORPAY_KEY_SECRET`; idempotency guard on `status === 'pending_payment'`; `razorpay.payments.fetch(paymentId)` and confirm `status === 'captured'`; set `paid`, store payment id + signature, `fulfillOrder(order)`.
- **`POST /webhook`** (named export `razorpayWebhookHandler`) — raw body, HMAC verify against `RAZORPAY_WEBHOOK_SECRET`; on `event === 'payment.captured'`, find order by `razorpayOrderId`, idempotent guard, fulfill. Always return `200 { received: true }`.
- **Remove** `POST /demo-pay/:orderId` and the Stripe import/session logic from `/checkout`.
- **Keep unchanged:** `fulfillOrder`, `GET /my`, `GET /:id`.

### `backend/src/index.js`
```diff
- import orderRoutes, { stripeWebhookHandler } from './routes/orders.js';
+ import orderRoutes, { razorpayWebhookHandler } from './routes/orders.js';
- app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);
+ app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), razorpayWebhookHandler);
```

### Admin routes — `backend/src/routes/admin.js`
**No changes.** Admin only touches `status` (approve: `paid`→`approved`; ship: `approved`→`shipped`) and analytics `$match`es on `status`, never payment fields.

## Frontend Changes

### `frontend/index.html`
Add Razorpay checkout script:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### `frontend/package.json`
Remove now-unused `html5-qrcode` and `qrcode` deps (used only by the removed demo QR UI).

### `frontend/src/api/index.js`
```diff
- export async function demoPay(orderId) {
-   return apiFetch(`/orders/demo-pay/${orderId}`, { method: 'POST' });
- }
+ export async function verifyPayment(orderId, { razorpayPaymentId, razorpaySignature }) {
+   return apiFetch(`/orders/verify/${orderId}`, {
+     method: 'POST',
+     body: JSON.stringify({ razorpayPaymentId, razorpaySignature }),
+   });
+ }
```

### `frontend/src/pages/shop/Checkout.jsx` — rewrite
- Remove: `UPI_ID`, `buildUpiIntent`, `paytmValue`, QR `useEffect`, scanner `useEffect`, the `paytm-panel` JSX, `html5-qrcode`/`qrcode` imports, the `demo` branch.
- After `checkout()` returns the payload, open the Razorpay modal:
```js
const rzp = new window.Razorpay({
  key: result.key, amount: result.amount, currency: result.currency,
  name: 'Glowora',
  order_id: result.razorpayOrderId,
  prefill: { name: form.fullName, email: form.email, contact: form.phone },
  method: { upi: true, card: false, netbanking: false, wallet: false },
  config: { display: { blocks: { upi: { name: 'Pay via UPI', instruments: [
    { method: 'upi', flows: ['intent', 'collect'] }  // GPay/PhonePe deep-link + QR
  ]}}}},
  handler: async (response) => {
    await verifyPayment(result.orderId, {
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
    });
    clearCart();
    navigate(`/checkout/success?orderId=${result.orderId}`);
  },
  modal: { ondismiss: () => setLoading(false) },
});
rzp.on('payment.failed', (resp) => setError(resp.error.description));
rzp.open();
```

### `frontend/src/pages/shop/CheckoutSuccess.jsx` — simplify
Remove QR generation, `html5-qrcode` scanner, scanned-order state. Becomes a clean confirmation screen: success header, order meta grid (number/total/status), order-history link, and a "receipt emailed" note.

## Error Handling

| Scenario | Behavior |
|---|---|
| Razorpay keys missing | `/checkout` returns 500 "Razorpay not configured" |
| Modal dismissed | `modal.ondismiss` resets `loading`, order stays `pending_payment` |
| Payment failed in modal | `payment.failed` → show `error.description`, order stays `pending_payment` |
| Verify signature mismatch | `/verify` returns 400 "Invalid signature" |
| Payment not captured | `/verify` fetches payment; if not `captured` returns 402 "Payment not captured" |
| Webhook signature mismatch | returns 400 (Razorpay will retry) |
| Webhook arrives before/after verify | idempotency guard — second handler is a no-op |
| Stock insufficient at checkout | 400 "Insufficient stock" (unchanged) |

## Testing

Manual (can't run real money flow in CI):
1. `npm install` in backend, confirm `razorpay` resolves.
2. Backend smoke: with keys unset, `POST /api/orders/checkout` returns clear 500. With test keys set (test mode), checkout returns a valid `razorpayOrderId`.
3. Frontend smoke: `npm run build` succeeds; Razorpay script loads; modal opens with UPI method only.
4. Full flow in Razorpay **test mode** (test card / UPI ID, or the Razorpay test `success` trigger): modal → verify → order `paid` → receipt (console log if no SMTP) → stock decremented.
5. Webhook: trigger via Razorpay dashboard "Test Webhook" → order stays/turns `paid`, no double fulfillment.

Automated (added):
- Unit test for webhook/verify signature verification logic using known Razorpay test vectors (HMAC over known payload → expected hex).

## Deployment Notes

Set in Render dashboard (production secrets):
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
- Register webhook URL `https://<backend>/api/orders/webhook` in Razorpay dashboard, subscribe to `payment.captured`, copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET`.
