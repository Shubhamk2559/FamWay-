const router = require("express").Router();
const { getOrders } = require("../controllers/orderController");

router.get("/:merchantId", getOrders);

module.exports = router;
