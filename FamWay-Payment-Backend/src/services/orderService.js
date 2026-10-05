const crypto = require("crypto");
const Order = require("../models/Order");
const PaymentLink = require("../models/PaymentLink");
const AppError = require("../utils/AppError");

const ORDER_TTL_MS = 15 * 60 * 1000;

async function expireStale(merchantId) {
  await Order.updateMany(
    { merchant: merchantId, status: "pending", expiresAt: { $lt: new Date() } },
    { $set: { status: "expired" } }
  );
}

// 0..99 in random order
function extraPaise() {
  const a = Array.from({ length: 100 }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function createPendingOrder({ link, merchantId }) {
  await expireStale(merchantId);

  for (const extra of extraPaise()) {
    try {
      return await Order.create({
        merchant: merchantId,
        paymentLink: link._id,
        amountPaise: link.amountPaise,
        payAmountPaise: link.amountPaise + extra,
        publicId: crypto.randomBytes(12).toString("base64url"),
        status: "pending",
        expiresAt: new Date(Date.now() + ORDER_TTL_MS),
      });
    } catch (err) {
      // slot taken by another pending order, try the next amount
      if (err.code === 11000 && err.keyPattern && err.keyPattern.payAmountPaise) continue;
      throw err;
    }
  }
  throw new AppError("Too many payments in progress. Please try again in a few minutes.", 503);
}

// Atomic: an order can only be marked paid once.
async function markOrderPaid(filter, { utr, via }) {
  const set = { status: "paid", paidAt: new Date(), paidVia: via };
  if (utr) set.utr = utr;

  const order = await Order.findOneAndUpdate(
    { ...filter, status: "pending" },
    { $set: set },
    { new: true }
  );
  if (order) await PaymentLink.updateOne({ _id: order.paymentLink }, { $inc: { paymentsCount: 1 } });
  return order;
}

function buildUpiUri({ upiId, name, payAmountPaise, orderNumber }) {
  const enc = (v) => encodeURIComponent(v).replace(/%40/g, "@");
  const am = (payAmountPaise / 100).toFixed(2);
  return `upi://pay?pa=${enc(upiId)}&pn=${enc(name)}&am=${am}&cu=INR&tn=${enc(orderNumber)}`;
}

module.exports = { createPendingOrder, markOrderPaid, buildUpiUri, expireStale };
