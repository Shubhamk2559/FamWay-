const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, isObjectId } = require("../utils/helpers");
const { markOrderPaid } = require("../services/orderService");

// GET /api/orders?status=&page=&limit=
exports.getOrders = asyncHandler(async (req, res) => {
  const filter = { merchant: req.merchant._id };
  if (req.query.status) {
    if (!["created", "pending", "paid", "failed", "expired"].includes(req.query.status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = req.query.status;
  }

  const { page, limit, skip } = parsePagination(req.query);
  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("paymentLink", "title slug"),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// PATCH /api/orders/:id/mark-paid  (manual fallback)
exports.markPaid = asyncHandler(async (req, res) => {
  if (!isObjectId(req.params.id)) throw new AppError("Invalid order id", 400);
  const order = await markOrderPaid(
    { _id: req.params.id, merchant: req.merchant._id },
    { via: "manual" }
  );
  if (!order) throw new AppError("Order not found or not pending", 404);
  res.json({ success: true, data: order });
});
