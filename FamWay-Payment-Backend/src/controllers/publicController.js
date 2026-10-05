const QRCode = require("qrcode");
const PaymentLink = require("../models/PaymentLink");
const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { createPendingOrder, buildUpiUri } = require("../services/orderService");

const rupees = (paise) => (paise / 100).toFixed(2);

async function loadPayableLink(slug) {
  const link = await PaymentLink.findOne({ slug: String(slug) }).populate("merchant");
  if (!link || !link.merchant) throw new AppError("Payment link not found", 404);

  let reason = "";
  if (link.status !== "active") reason = "This payment link is no longer active.";
  else if (link.expiresAt && link.expiresAt < new Date()) reason = "This payment link has expired.";
  else if (link.merchant.status !== "active") reason = "This merchant is unavailable.";
  else if (!link.merchant.upiId) reason = "This merchant is not ready to accept payments yet.";

  return { link, merchant: link.merchant, reason };
}

// GET /api/public/links/:slug
exports.getLink = asyncHandler(async (req, res) => {
  const { link, merchant, reason } = await loadPayableLink(req.params.slug);
  res.json({
    success: true,
    data: {
      title: link.title,
      description: link.description,
      amount: rupees(link.amountPaise),
      merchantName: merchant.businessName,
      payable: !reason,
      reason,
    },
  });
});

// POST /api/public/links/:slug/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const { link, merchant, reason } = await loadPayableLink(req.params.slug);
  if (reason) throw new AppError(reason, 409);

  const order = await createPendingOrder({ link, merchantId: merchant._id });
  const upiUri = buildUpiUri({
    upiId: merchant.upiId,
    name: merchant.businessName,
    payAmountPaise: order.payAmountPaise,
    orderNumber: order.orderNumber,
  });
  const qrDataUrl = await QRCode.toDataURL(upiUri, { width: 300, margin: 1 });

  res.status(201).json({
    success: true,
    data: {
      orderId: order.publicId,
      orderNumber: order.orderNumber,
      payAmount: rupees(order.payAmountPaise),
      expiresAt: order.expiresAt,
      merchantName: merchant.businessName,
      upiId: merchant.upiId,
      upiUri,
      qrDataUrl,
    },
  });
});

// GET /api/public/orders/:orderId/status
exports.getOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ publicId: String(req.params.orderId) });
  if (!order) throw new AppError("Order not found", 404);

  let status = order.status;
  if (status === "pending" && order.expiresAt && order.expiresAt < new Date()) {
    await Order.updateOne({ _id: order._id, status: "pending" }, { $set: { status: "expired" } });
    status = "expired";
  }
  res.json({
    success: true,
    data: { status, payAmount: rupees(order.payAmountPaise), expiresAt: order.expiresAt },
  });
});
