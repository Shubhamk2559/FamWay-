const router = require("express").Router();

const {
  getPaymentSettings,
  updatePaymentSettings,
  disconnectGmail,
} = require("../controllers/settingsController");

router.get("/payment", getPaymentSettings);

router.put("/payment", updatePaymentSettings);

router.delete("/payment/gmail", disconnectGmail);

module.exports = router;
