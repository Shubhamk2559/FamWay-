const mongoose = require("mongoose");
const crypto = require("crypto");

const orderSchema = new mongoose.Schema(
  {
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
    paymentLink: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentLink", required: true },
    orderNumber: {
      type: String,
      unique: true,
      default: () => `FW-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
    },
    amountPaise: { type: Number, required: true, min: 100 },
    currency: { type: String, default: "INR" },
    customer: {
      name: { type: String, trim: true, default: "" },
      email: { type: String, trim: true, lowercase: true, default: "" },
      phone: { type: String, trim: true, default: "" },
    },
    status: {
      type: String,
      enum: ["created", "pending", "paid", "failed", "expired"],
      default: "created",
    },
    razorpayOrderId: { type: String, index: true, sparse: true },
    razorpayPaymentId: { type: String },
    paidAt: { type: Date },
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

orderSchema.index({ merchant: 1, createdAt: -1 });
orderSchema.index({ merchant: 1, status: 1 });

orderSchema.virtual("amount").get(function () {
  return this.amountPaise / 100;
});

module.exports = mongoose.model("Order", orderSchema);
