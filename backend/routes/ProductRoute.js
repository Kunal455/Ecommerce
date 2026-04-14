const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const { createProduct, updateProduct, deleteProduct, getProducts, getProductById, getSimilarProducts, getBestSellers, getNewArrivals } = require('../controllers/ProductController')
const cacheMiddleware = require('../Middleware/redisCache');
const router = express.Router();

// Public routes
router.get("/", cacheMiddleware('products', 3600), getProducts)
router.get("/best-sellers", cacheMiddleware('products:best-sellers', 3600), getBestSellers)
router.get("/new-arrivals", cacheMiddleware('products:new-arrivals', 3600), getNewArrivals)
router.get("/:id", getProductById)
router.get("/similar/:id", getSimilarProducts)

// Protected routes (require login but not admin)
router.post("/", protect, createProduct)
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router