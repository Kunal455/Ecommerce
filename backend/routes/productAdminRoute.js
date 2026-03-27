const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const { getAdminProducts } = require("../controllers/productAdminController");

// GET /api/admin/products
router.get("/", protect, admin, getAdminProducts);

module.exports = router;