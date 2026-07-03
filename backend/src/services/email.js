import nodemailer from 'nodemailer';
import { formatPrice } from '../utils/format.js';

function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatOrderDate(date) {
  if (!date) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(date));
}

function getItemProductId(item) {
  if (!item?.product) return '';
  if (item.product._id) return item.product._id.toString();
  if (item.product.toString) return item.product.toString();
  return '';
}

function getAddressLines(shippingAddress = {}) {
  const lineOne = shippingAddress.address;
  const lineTwo = [shippingAddress.city, shippingAddress.state, shippingAddress.zip]
    .filter(Boolean)
    .join(', ');
  return [lineOne, lineTwo].filter(Boolean);
}

function buildPlainTextConfirmation(order, email) {
  const orderNumber = order.orderNumber || order._id?.toString() || 'Order';
  const items = (order.items || [])
    .map((item) => {
      const productId = getItemProductId(item);
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
      return [
        `- ${item.name || 'Product'}`,
        productId ? `  Product ID: ${productId}` : '',
        `  Quantity: ${item.quantity}`,
        `  Unit price: ${formatPrice(item.price)}`,
        `  Line total: ${formatPrice(lineTotal)}`,
      ].filter(Boolean).join('\n');
    })
    .join('\n\n');

  const addressLines = getAddressLines(order.shippingAddress);

  return [
    'Glowora order confirmation',
    '',
    `Order number: ${orderNumber}`,
    order._id ? `Order ID: ${order._id.toString()}` : '',
    order.razorpayOrderId ? `Razorpay order ID: ${order.razorpayOrderId}` : '',
    order.razorpayPaymentId ? `Payment ID: ${order.razorpayPaymentId}` : '',
    `Payment status: ${String(order.status || '').replace('_', ' ').toUpperCase()}`,
    `Payment method: ${order.paymentMethod || 'razorpay'}`,
    `Order date: ${formatOrderDate(order.createdAt)}`,
    '',
    'Customer',
    `Name: ${order.shippingAddress?.fullName || 'Not provided'}`,
    `Email: ${email}`,
    order.shippingAddress?.phone ? `Phone: ${order.shippingAddress.phone}` : '',
    addressLines.length ? `Shipping address: ${addressLines.join(', ')}` : '',
    '',
    'Items',
    items || 'No items listed',
    '',
    `Subtotal: ${formatPrice(order.subtotal)}`,
    Number(order.discount || 0) > 0 ? `Discount: -${formatPrice(order.discount)}` : '',
    `Total paid: ${formatPrice(order.total)}`,
  ].filter((line) => line !== '').join('\n');
}

export function buildOrderConfirmationEmail(order, email) {
  const orderNumber = order.orderNumber || order._id?.toString() || 'Order';
  const safeOrderNumber = escapeHtml(orderNumber);
  const safeOrderId = escapeHtml(order._id?.toString() || orderNumber);
  const safeRazorpayOrderId = escapeHtml(order.razorpayOrderId || 'Not available');
  const safePaymentId = escapeHtml(order.razorpayPaymentId || 'Not available');
  const safePaymentMethod = escapeHtml(order.paymentMethod || 'razorpay');
  const safeStatus = escapeHtml(String(order.status || 'paid').replace('_', ' ').toUpperCase());
  const shippingAddress = order.shippingAddress || {};
  const addressLines = getAddressLines(shippingAddress);

  const itemsHtml = (order.items || [])
    .map((item) => {
      const productId = getItemProductId(item);
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
      return `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #e5edf3">
            <div style="font-weight:700;color:#1A2B3C">${escapeHtml(item.name || 'Product')}</div>
            ${productId ? `<div style="font-size:12px;color:#6B7C8D;margin-top:4px">Product ID: ${escapeHtml(productId)}</div>` : ''}
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #e5edf3;text-align:center;color:#1A2B3C">${escapeHtml(item.quantity)}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #e5edf3;text-align:right;color:#1A2B3C">${escapeHtml(formatPrice(item.price))}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #e5edf3;text-align:right;color:#1A2B3C;font-weight:700">${escapeHtml(formatPrice(lineTotal))}</td>
        </tr>`;
    })
    .join('');

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:680px;margin:0 auto;background:#F8FCFE;padding:32px;border-radius:16px;color:#1A2B3C">
      <h1 style="color:#3A9BC4;font-family:Georgia,serif;margin:0 0 8px">Glowora</h1>
      <p style="color:#6B7C8D;margin:0 0 24px">Your payment is confirmed. Here are your complete order details.</p>

      <div style="background:white;padding:24px;border-radius:12px;box-shadow:0 4px 24px rgba(135,206,235,0.15)">
        <h2 style="margin:0 0 16px;color:#1A2B3C">Order Confirmation - ${safeOrderNumber}</h2>

        <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
          <tbody>
            <tr>
              <td style="padding:6px 0;color:#6B7C8D">Order ID</td>
              <td style="padding:6px 0;text-align:right;font-weight:700">${safeOrderId}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6B7C8D">Razorpay Order ID</td>
              <td style="padding:6px 0;text-align:right">${safeRazorpayOrderId}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6B7C8D">Payment ID</td>
              <td style="padding:6px 0;text-align:right">${safePaymentId}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6B7C8D">Payment Method</td>
              <td style="padding:6px 0;text-align:right">${safePaymentMethod}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6B7C8D">Payment Status</td>
              <td style="padding:6px 0;text-align:right;font-weight:700;color:#15803d">${safeStatus}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6B7C8D">Order Date</td>
              <td style="padding:6px 0;text-align:right">${escapeHtml(formatOrderDate(order.createdAt))}</td>
            </tr>
          </tbody>
        </table>

        <div style="background:#F8FCFE;border:1px solid #e5edf3;border-radius:10px;padding:16px;margin:0 0 20px">
          <h3 style="margin:0 0 10px;color:#1A2B3C;font-size:16px">Customer & Shipping</h3>
          <p style="margin:4px 0"><strong>Name:</strong> ${escapeHtml(shippingAddress.fullName || 'Not provided')}</p>
          <p style="margin:4px 0"><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${shippingAddress.phone ? `<p style="margin:4px 0"><strong>Phone:</strong> ${escapeHtml(shippingAddress.phone)}</p>` : ''}
          ${addressLines.length ? `<p style="margin:4px 0"><strong>Address:</strong> ${escapeHtml(addressLines.join(', '))}</p>` : ''}
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <thead>
            <tr style="background:#E8F4FA">
              <th style="padding:10px 8px;text-align:left">Product</th>
              <th style="padding:10px 8px;text-align:center">Qty</th>
              <th style="padding:10px 8px;text-align:right">Unit Price</th>
              <th style="padding:10px 8px;text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="border-top:2px solid #87CEEB;padding-top:12px;text-align:right">
          <p style="margin:4px 0"><strong>Subtotal:</strong> ${escapeHtml(formatPrice(order.subtotal))}</p>
          ${Number(order.discount || 0) > 0 ? `<p style="margin:4px 0;color:#3A9BC4"><strong>Discount:</strong> -${escapeHtml(formatPrice(order.discount))}</p>` : ''}
          <p style="margin:8px 0 0;font-size:18px"><strong>Total Paid:</strong> ${escapeHtml(formatPrice(order.total))}</p>
        </div>
      </div>

      <p style="color:#94A3B4;font-size:13px;margin-top:24px;text-align:center">Glowora Skincare</p>
    </div>`;

  return {
    subject: `Your Glowora order is confirmed - ${orderNumber}`,
    html,
    text: buildPlainTextConfirmation(order, email),
  };
}

export async function sendOrderReceipt(order, userEmail) {
  const transporter = createTransporter();
  const email = order.shippingAddress?.email || userEmail;
  if (!email) return false;
  const message = buildOrderConfirmationEmail(order, email);

  if (!transporter) {
    console.log(`[Email Demo] Order confirmation for ${order.orderNumber || order._id} -> ${email}`);
    console.log(message.text);
    return true;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Glowora" <noreply@glowora.com>',
    to: email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
  return true;
}

/**
 * Send a 6-digit OTP to verify a user's email.
 * In dev (no SMTP configured) the code is logged to the server console
 * so you can complete verification without a mailbox.
 */
export async function sendOtp(email, code, subject = 'Your Glowora verification code', title = 'Verify your email address') {
  if (!email) return false;

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#F8FBFF;padding:32px;border-radius:16px">
      <h1 style="color:#2563eb;font-family:Georgia,serif;margin:0 0 8px">Glowora</h1>
      <p style="color:#475569;margin:0 0 24px">${title}</p>
      <div style="background:white;padding:28px;border-radius:12px;box-shadow:0 4px 24px rgba(59,130,246,0.15);text-align:center">
        <p style="color:#1e293b;margin:0 0 12px">Your verification code is:</p>
        <div style="font-family:Georgia,serif;font-size:2.4rem;font-weight:700;letter-spacing:10px;color:#2563eb;margin:8px 0 16px">${code}</div>
        <p style="color:#94a3b8;font-size:0.85em;margin:0">This code expires in 10 minutes.</p>
      </div>
      <p style="color:#94a3b4;font-size:0.85em;margin-top:24px;text-align:center">If you didn't request this, you can ignore this email.</p>
    </div>`;

  if (!createTransporter()) {
    console.log(`[Email Demo] OTP for ${email} → ${code} (Subject: ${subject})`);
    return true;
  }

  await createTransporter().sendMail({
    from: process.env.SMTP_FROM || '"Glowora" <noreply@glowora.com>',
    to: email,
    subject: subject,
    html,
  });
  return true;
}
