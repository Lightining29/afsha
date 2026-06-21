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
