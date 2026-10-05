const router = require("express").Router();
const auth = require("../middleware/auth");

router.use("/auth", require("./authRoutes"));
router.use("/public", require("./publicRoutes"));
router.use("/payment-links", auth, require("./paymentLinkRoutes"));
router.use("/orders", auth, require("./orderRoutes"));
router.use("/settings", auth, require("./settingsRoutes"));

module.exports = router;
