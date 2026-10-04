const mongoose = require("mongoose");
const env = require("../config/env");

const paymentLinkSchema = new mongoose.Schema(
  {
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 200, default: "" },
    customerName: { type: String, trim: true, maxlength: 100, default: "" },
    amountPaise: { type: Number, required: true, min: 100 }, // stored in paise
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["active", "expired", "disabled"], default: "active" },
    expiresAt: { type: Date },
    paymentsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
  }
);

paymentLinkSchema.index({ merchant: 1, createdAt: -1 });

paymentLinkSchema.virtual("amount").get(function () {
  return this.amountPaise / 100; // rupees
});
paymentLinkSchema.virtual("url").get(function () {
  return `${env.publicBaseUrl}/pay/${this.slug}`;
});

module.exports = mongoose.model("PaymentLink", paymentLinkSchema);
