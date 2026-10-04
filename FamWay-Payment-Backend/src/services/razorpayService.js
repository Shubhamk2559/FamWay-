const Razorpay = require("razorpay");
const crypto = require("crypto");
const env = require("../config/env");
const AppError = require("../utils/AppError");

let client;

// Server-side only. The secret key never leaves this file or the server.
function getClient() {
  const { keyId, keySecret } = env.razorpay;
  if (!keyId || !keySecret) throw new AppError("Razorpay is not configured", 503);
  if (!keyId.startsWith("rzp_test_")) {
    throw new AppError("Only Razorpay test keys (rzp_test_...) are allowed", 500);
  }
  if (!client) client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return client;
}

async function createOrder({ amountPaise, receipt, notes = {} }) {
  const order = await getClient().orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: String(receipt).slice(0, 40),
    notes,
  });
  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    receipt: order.receipt,
  };
}

function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(String(b || ""));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

// Verifies the signature returned by Razorpay Checkout after a payment.
function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!env.razorpay.keySecret) throw new AppError("Razorpay is not configured", 503);
  const expected = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

// Verifies webhook calls. rawBody must be the unparsed request body.
function verifyWebhookSignature(rawBody, signature) {
  if (!env.razorpay.webhookSecret) throw new AppError("Webhook secret is not configured", 503);
  const expected = crypto
    .createHmac("sha256", env.razorpay.webhookSecret)
    .update(rawBody)
    .digest("hex");
  return safeEqual(expected, signature);
}

// The only value that is safe to send to a client (for Razorpay Checkout).
function getPublicKeyId() {
  return env.razorpay.keyId;
}

module.exports = { createOrder, verifyPaymentSignature, verifyWebhookSignature, getPublicKeyId };
