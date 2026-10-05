const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination } = require("../utils/helpers");

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
