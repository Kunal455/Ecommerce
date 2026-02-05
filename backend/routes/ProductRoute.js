const express = require("express");
const Product = require("../models/Product");
const { protect } = require("../Middleware/authMiddleware");
const {createProduct} = require('../controllers/ProductController')
const router = express.Router();

// @route POST /api/products
// @desc Create product
// @access Private/Admin
router.post("/products", protect, createProduct)

  
module.exports = router