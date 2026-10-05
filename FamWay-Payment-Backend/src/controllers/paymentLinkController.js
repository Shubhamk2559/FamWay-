const crypto = require("crypto");
const PaymentLink = require("../models/PaymentLink");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination } = require("../utils/helpers");

const makeSlug = () => crypto.randomBytes(6).toString("base64url").slice(0, 8);
const clean = (v) => (typeof v === "string" ? v.trim() : "");

async function createWithUniqueSlug(data) {
  for (let i = 0; i < 5; i++) {
    try {
      return await PaymentLink.create({ ...data, slug: makeSlug() });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) continue;
      throw err;
    }
  }
  throw new AppError("Could not generate a unique link, please retry", 500);
}

// POST /api/payment-links
exports.createPaymentLink = asyncHandler(async (req, res) => {
  const { amount, expiresAt } = req.body;
  const description = clean(req.body.description);
  const customerName = clean(req.body.customerName);
  const title = clean(req.body.title) || description || customerName || "Payment Link";

  const rupees = Number(amount);
  if (!Number.isFinite(rupees) || rupees < 1 || rupees > 500000) {
    throw new AppError("amount must be a number between 1 and 500000 (in rupees)", 400);
  }

  let expiry;
  if (expiresAt) {
    expiry = new Date(expiresAt);
    if (Number.isNaN(expiry.getTime()) || expiry <= new Date()) {
      throw new AppError("expiresAt must be a valid future date", 400);
    }
  }

  const link = await createWithUniqueSlug({
    merchant: req.merchant._id,
    title,
    description,
    customerName,
    amountPaise: Math.round(rupees * 100),
    expiresAt: expiry,
  });

  res.status(201).json({ success: true, data: link });
});

// GET /api/payment-links?status=&page=&limit=
exports.getPaymentLinks = asyncHandler(async (req, res) => {
  const filter = { merchant: req.merchant._id };
  if (req.query.status) {
    if (!["active", "expired", "disabled"].includes(req.query.status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = req.query.status;
  }

  const { page, limit, skip } = parsePagination(req.query);
  const [items, total] = await Promise.all([
    PaymentLink.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    PaymentLink.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});
