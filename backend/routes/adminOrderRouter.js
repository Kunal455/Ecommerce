const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const { getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/adminOrderController");

// GET /api/admin/orders
router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);
module.exports = router;