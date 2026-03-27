const express = require('express');
const { protect } = require("../Middleware/authMiddleware.js");
const { getMyOrders, getOrderById } = require("../controllers/OrderController");
const router = express.Router();

router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;