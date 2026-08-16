const express = require("express");
const { protect, admin } = require("../Middleware/authMiddleware");
const { cacheFilters } = require("../Middleware/redisCache");
const { createProduct, updateProduct, deleteProduct, getProducts, getProductById, getSimilarProducts, getBestSellers, getNewArrivals, getFilters } = require('../controllers/ProductController')
const router = express.Router();

// Public routes
router.get("/", cacheFilters(300), getProducts)
router.get("/filters", cacheFilters(3600), getFilters)
router.get("/best-sellers", cacheFilters(300), getBestSellers)
router.get("/new-arrivals", cacheFilters(300), getNewArrivals)
router.get("/:id", getProductById)
router.get("/similar/:id", cacheFilters(300), getSimilarProducts)

// Protected routes (require login but not admin)
router.post("/", protect, admin, createProduct)
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router