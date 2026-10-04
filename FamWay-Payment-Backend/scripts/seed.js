const mongoose = require("mongoose");
const env = require("../src/config/env");
const Merchant = require("../src/models/Merchant");

(async () => {
  await mongoose.connect(env.mongoUri);
  const m = await Merchant.findOneAndUpdate(
    { email: "aarav@aaravstores.com" },
    {
      name: "Aarav Sharma",
      businessName: "Aarav Stores",
      phone: "9876543210",
      upiId: "aaravstores@upi",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Demo merchant ID:", m._id.toString());
  await mongoose.disconnect();
})();
