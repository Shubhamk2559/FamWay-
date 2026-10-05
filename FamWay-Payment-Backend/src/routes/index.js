const router = require("express").Router();
const auth = require("../middleware/auth");

router.use("/auth", require("./authRoutes"));

router.use("/payment-links", auth, require("./paymentLinkRoutes"));
router.use("/orders", auth, require("./orderRoutes"));

module.exports = router;
