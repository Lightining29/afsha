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
    'Afsha Enterprises order confirmation',
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
    <div style="font-family:'Inter',Arial,sans-serif;max-width:680px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:16px;color:#0f172a">
      <div style="background:#ffffff;padding:28px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid #cbd5e1">
        
        <!-- Header -->
        <div style="border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:24px">
          <h1 style="color:#0f172a;font-family:'Inter',Arial,sans-serif;font-size:24px;font-weight:900;margin:0 0 4px">Afsha Enterprises</h1>
          <p style="color:#334155;font-size:13px;font-weight:700;margin:0 0 6px">Official Retail & E-Commerce Store</p>
          <p style="color:#475569;font-size:12px;margin:2px 0">📍 <strong>Registered Address:</strong> 75 Raja Muthai Road, Periyamet, Opposite Nehru Stadium Main Gate</p>
          <p style="color:#475569;font-size:12px;margin:2px 0">📞 <strong>Helpline:</strong> +91 96071 11312 | ✉️ <strong>Email:</strong> support@afshaenterprises.com</p>
          <p style="color:#64748b;font-size:11px;margin:4px 0 0">GSTIN: 27AAACA1234A1Z5 | Reg. No: MH-PUNE-413801</p>
        </div>

        <!-- Title & Stamp -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
          <div>
            <h2 style="margin:0 0 4px;color:#0f172a;font-size:20px;font-weight:900">TAX INVOICE RECEIPT</h2>
            <div style="font-size:13px;color:#475569">Receipt #: INV-${safeOrderNumber}</div>
            <div style="font-size:13px;color:#475569">Date: ${escapeHtml(formatOrderDate(order.createdAt))}</div>
          </div>
          <div style="border:2px solid #059669;color:#059669;font-weight:900;font-size:12px;padding:6px 14px;border-radius:6px;text-transform:uppercase;letter-spacing:1px">
            OFFICIAL RECEIPT — PAID
          </div>
        </div>

        <!-- Customer & Order Meta -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:24px">
          <h3 style="margin:0 0 10px;color:#0f172a;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">Customer & Shipping Details</h3>
          <p style="margin:4px 0;font-size:13px"><strong>Name:</strong> ${escapeHtml(shippingAddress.fullName || 'Valued Customer')}</p>
          <p style="margin:4px 0;font-size:13px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${shippingAddress.phone ? `<p style="margin:4px 0;font-size:13px"><strong>Phone:</strong> ${escapeHtml(shippingAddress.phone)}</p>` : ''}
          ${addressLines.length ? `<p style="margin:4px 0;font-size:13px"><strong>Address:</strong> ${escapeHtml(addressLines.join(', '))}</p>` : ''}
          <p style="margin:8px 0 0;font-size:13px;color:#475569"><strong>Payment Mode:</strong> ${safePaymentMethod} | <strong>Payment Status:</strong> <span style="color:#059669;font-weight:700">${safeStatus}</span></p>
        </div>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <thead>
            <tr style="background:#0f172a;color:#ffffff">
              <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase">Item Description</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;text-transform:uppercase">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase">Rate (₹)</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <!-- Summary -->
        <div style="width:280px;margin-left:auto;border-top:2px solid #0f172a;padding-top:10px;margin-bottom:24px">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;padding:3px 0">
            <span>Subtotal:</span>
            <span>${escapeHtml(formatPrice(order.subtotal || order.total))}</span>
          </div>
          ${Number(order.discount || 0) > 0 ? `
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#e94057;font-weight:700;padding:3px 0">
            <span>Discount:</span>
            <span>-${escapeHtml(formatPrice(order.discount))}</span>
          </div>` : ''}
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;padding:3px 0">
            <span>Delivery & Handling:</span>
            <span style="color:#0f172a;font-weight:600">Included</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:17px;font-weight:900;color:#0f172a;border-top:1px solid #cbd5e1;padding-top:8px;margin-top:4px">
            <span>Total Paid:</span>
            <span>${escapeHtml(formatPrice(order.total))}</span>
          </div>
        </div>

        <!-- Footer Terms -->
        <div style="border-top:1px solid #e2e8f0;padding-top:16px;font-size:11px;color:#64748b">
          <p style="margin:2px 0"><strong>Terms & Conditions:</strong></p>
          <p style="margin:2px 0">1. Backed by 1-Year Afsha Enterprises Brand Warranty.</p>
          <p style="margin:2px 0">2. Computer generated Tax Invoice Receipt — Official proof of payment.</p>
          <p style="margin:2px 0">3. Thank you for shopping with Afsha Enterprises!</p>
        </div>
      </div>

      <p style="color:#94a3b8;font-size:12px;margin-top:20px;text-align:center">© ${new Date().getFullYear()} Afsha Enterprises. All rights reserved.</p>
    </div>`;

  return {
    subject: `Official Payment Receipt & Tax Invoice - INV-${safeOrderNumber}`,
    html,
    text: buildPlainTextConfirmation(order, email),
  };
}

export async function sendOrderReceipt(order, userEmail) {
  try {
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
      from: process.env.SMTP_FROM || '"Afsha Enterprises" <noreply@afshaenterprises.com>',
      to: email,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
    return true;
  } catch (err) {
    console.error('[SMTP Warning] Failed to send order receipt:', err.message);
    return false;
  }
}

export async function sendOtp(email, code, subject = 'Your Afsha Enterprises verification code', title = 'Verify your email address') {
  if (!email) return false;

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#F8FBFF;padding:32px;border-radius:16px">
      <h1 style="color:#E94057;font-family:Georgia,serif;margin:0 0 8px">Afsha Enterprises</h1>
      <p style="color:#475569;margin:0 0 24px">${title}</p>
      <div style="background:white;padding:28px;border-radius:12px;box-shadow:0 4px 24px rgba(233,64,87,0.15);text-align:center">
        <p style="color:#1e293b;margin:0 0 12px">Your verification code is:</p>
        <div style="font-family:Georgia,serif;font-size:2.4rem;font-weight:700;letter-spacing:10px;color:#E94057;margin:8px 0 16px">${code}</div>
        <p style="color:#94a3b8;font-size:0.85em;margin:0">This code expires in 10 minutes.</p>
      </div>
      <p style="color:#94a3b4;font-size:0.85em;margin-top:24px;text-align:center">If you didn't request this, you can ignore this email.</p>
    </div>`;

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Email Demo] OTP for ${email} → ${code} (Subject: ${subject})`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Afsha Enterprises" <noreply@afshaenterprises.com>',
      to: email,
      subject: subject,
      html,
    });
    return true;
  } catch (err) {
    console.error(`[SMTP Warning] Failed to send OTP to ${email}:`, err.message);
    return false;
  }
}
