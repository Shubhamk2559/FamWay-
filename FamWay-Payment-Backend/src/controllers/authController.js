const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const Merchant = require("../models/Merchant");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const clean = (v) => (typeof v === "string" ? v.trim() : "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (merchant) =>
  jwt.sign({ sub: merchant._id.toString() }, env.jwt.secret, {
    algorithm: "HS256",
    expiresIn: env.jwt.expiresIn,
  });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const name = clean(req.body.name);
  const businessName = clean(req.body.businessName);
  const email = clean(req.body.email).toLowerCase();
  const phone = clean(req.body.phone);
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!name || !businessName) throw new AppError("Name and business name are required", 400);
  if (!EMAIL_RE.test(email)) throw new AppError("Enter a valid email", 400);
  if (phone && !/^\d{10}$/.test(phone)) throw new AppError("Mobile number must be 10 digits", 400);
  if (password.length < 8 || password.length > 72) {
    throw new AppError("Password must be 8 to 72 characters", 400);
  }

  if (await Merchant.exists({ email })) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const merchant = await Merchant.create({ name, businessName, email, phone, passwordHash });

  res.status(201).json({ success: true, token: signToken(merchant), data: merchant });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const email = clean(req.body.email).toLowerCase();
  const password = typeof req.body.password === "string" ? req.body.password : "";

  const merchant = await Merchant.findOne({ email }).select("+passwordHash");
  const ok = merchant && merchant.passwordHash && (await bcrypt.compare(password, merchant.passwordHash));

  // Same message for unknown email and wrong password
  if (!ok) throw new AppError("Invalid email or password", 401);
  if (merchant.status !== "active") throw new AppError("Account suspended", 403);

  res.json({ success: true, token: signToken(merchant), data: merchant });
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.merchant });
});
