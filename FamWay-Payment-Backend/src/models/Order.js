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
    publicId: { type: String, unique: true, sparse: true }, // unguessable id for the pay page
    amountPaise: { type: Number, required: true, min: 100 }, // link amount
    payAmountPaise: { type: Number, min: 100 }, // amount customer must pay (unique per pending order)
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
    expiresAt: { type: Date },
    utr: { type: String, unique: true, sparse: true },
    paidVia: { type: String, enum: ["email", "manual", "razorpay"] },
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
// One pending order per exact amount per merchant. This is what makes email matching safe.
orderSchema.index(
  { merchant: 1, payAmountPaise: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

orderSchema.virtual("amount").get(function () {
  return this.amountPaise / 100;
});
orderSchema.virtual("payAmount").get(function () {
  return (this.payAmountPaise || this.amountPaise) / 100;
});

module.exports = mongoose.model("Order", orderSchema);
