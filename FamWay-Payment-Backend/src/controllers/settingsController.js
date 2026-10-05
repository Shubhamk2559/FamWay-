const Merchant = require("../models/Merchant");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { encrypt } = require("../utils/crypto");

const clean = (v) => (typeof v === "string" ? v.trim() : "");

const UPI_RE = /^[a-z0-9._-]{2,64}@[a-z][a-z0-9]{1,30}$/;
const GMAIL_RE = /^[a-z0-9._%+-]+@gmail\.com$/;

const view = (m) => ({
  upiId: m.upiId || "",
  gmailAddress: m.gmailAddress || "",
  hasAppPassword: Boolean(m.gmailAppPasswordEnc),
});

exports.getPaymentSettings = asyncHandler(async (req, res) => {
  const m = await Merchant.findById(req.merchant._id)
    .select("+gmailAppPasswordEnc");

  res.json({
    success: true,
    data: view(m),
  });
});


exports.updatePaymentSettings = asyncHandler(async (req, res) => {
  const upiId = clean(req.body.upiId).toLowerCase();
  const gmailAddress = clean(req.body.gmailAddress).toLowerCase();
  const appPassword = clean(req.body.appPassword)
    .replace(/\s+/g, "");

  if (!UPI_RE.test(upiId)) {
    throw new AppError("Enter a valid UPI ID", 400);
  }

  if (!GMAIL_RE.test(gmailAddress)) {
    throw new AppError("Enter a valid Gmail address", 400);
  }

  if (appPassword && !/^[a-z]{16}$/i.test(appPassword)) {
    throw new AppError(
      "App password must be 16 letters",
      400
    );
  }

  const m = await Merchant.findById(req.merchant._id)
    .select("+gmailAppPasswordEnc");

  if (!appPassword && !m.gmailAppPasswordEnc) {
    throw new AppError(
      "Enter your Gmail app password",
      400
    );
  }

  m.upiId = upiId;
  m.gmailAddress = gmailAddress;

  if (appPassword) {
    m.gmailAppPasswordEnc = encrypt(appPassword);
  }

  await m.save();

  res.json({
    success: true,
    data: view(m),
  });
});


exports.disconnectGmail = asyncHandler(async (req, res) => {
  await Merchant.updateOne(
    { _id: req.merchant._id },
    {
      $unset: {
        gmailAddress: "",
        gmailAppPasswordEnc: "",
      },
    }
  );

  res.json({
    success: true,
  });
});
