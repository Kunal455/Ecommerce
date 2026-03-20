const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../Middleware/authMiddleware");
const {createProduct, updateProduct, deleteProduct, getProducts, getProductById, getSimilarProducts, getBestSellers, getNewArrivals} = require('../controllers/ProductController')
const router = express.Router();

// @route POST /api/v3/product
// @desc Create product
// @access Private/Admin
router.post("/", protect, admin, createProduct)
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.get("/", getProducts)
router.get("/best-sellers",getBestSellers)
router.get("/new-arrivals", getNewArrivals)
router.get("/:id", getProductById)
router.get("/similar/:id", getSimilarProducts)

module.exports = router