const router = require("express").Router();
const { getOrders, markPaid } = require("../controllers/orderController");

router.get("/", getOrders);
router.patch("/:id/mark-paid", markPaid);

module.exports = router;
