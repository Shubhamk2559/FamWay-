const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { getLink, createOrder, getOrderStatus } = require("../controllers/publicController");

const limiter = (limit) =>
  rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: true, legacyHeaders: false });

router.get("/links/:slug", limiter(120), getLink);
router.post("/links/:slug/orders", limiter(15), createOrder); // stops slot-hogging
router.get("/orders/:orderId/status", limiter(400), getOrderStatus);

module.exports = router;
