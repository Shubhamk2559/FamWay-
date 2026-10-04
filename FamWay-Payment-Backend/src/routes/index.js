const router = require("express").Router();

router.use("/payment-links", require("./paymentLinkRoutes"));
router.use("/orders", require("./orderRoutes"));

module.exports = router;
