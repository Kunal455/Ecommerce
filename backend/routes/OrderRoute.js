const express = require('express');
const { protect, admin } = require("../Middleware/authMiddleware.js");
const { getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require("../controllers/OrderController");
const router = express.Router();

router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin Routes
router.route("/").get(protect, admin, getAllOrders);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

module.exports = router;