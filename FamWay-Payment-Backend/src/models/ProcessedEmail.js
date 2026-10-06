const mongoose = require("mongoose");

const processedEmailSchema = new mongoose.Schema(
  {
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
    messageKey: { type: String, required: true }, // Message-ID header, or uidvalidity:uid
    result: {
      type: String,
      enum: ["processing", "paid", "no_match", "duplicate", "rejected", "ignored"],
      default: "processing",
    },
    reason: { type: String, maxlength: 200 },
    amountPaise: { type: Number },
    utr: { type: String },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    receivedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

processedEmailSchema.index({ merchant: 1, messageKey: 1 }, { unique: true });
processedEmailSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 14 });

module.exports = mongoose.model("ProcessedEmail", processedEmailSchema);
