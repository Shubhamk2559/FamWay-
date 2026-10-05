const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    businessName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    upiId: { type: String, trim: true },
    passwordHash: { type: String, select: false },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Merchant", merchantSchema);
