const jwt = require("jsonwebtoken");
const env = require("../config/env");
const Merchant = require("../models/Merchant");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

module.exports = asyncHandler(async (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new AppError("Authentication required", 401);
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwt.secret, { algorithms: ["HS256"] });
  } catch (_e) {
    throw new AppError("Invalid or expired token", 401);
  }

  const merchant = await Merchant.findById(payload.sub);
  if (!merchant || merchant.status !== "active") {
    throw new AppError("Account not found or suspended", 401);
  }

  req.merchant = merchant;
  next();
});
