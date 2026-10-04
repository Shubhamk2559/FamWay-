const router = require("express").Router();
const { createPaymentLink, getPaymentLinks } = require("../controllers/paymentLinkController");

router.post("/", createPaymentLink);
router.get("/:merchantId", getPaymentLinks);

module.exports = router;
