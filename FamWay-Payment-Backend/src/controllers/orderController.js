const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { isObjectId, parsePagination } = require("../utils/helpers");

// GET /api/orders/:merchantId?status=&page=&limit=
exports.getOrders = asyncHandler(async (req, res) => {
  const { merchantId } = req.params;
  if (!isObjectId(merchantId)) throw new AppError("Invalid merchantId", 400);

  const filter = { merchant: merchantId };
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
