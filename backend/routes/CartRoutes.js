const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");

const { addToCart, updateCart, deleteCartItem, getCarts, getUserCart, mergeCart } = require("../controllers/CartController");

router.post("/", protect, addToCart);
router.put("/", protect, updateCart);
router.delete("/", protect, deleteCartItem);
router.get("/", protect, getUserCart);
router.post("/merge", protect, mergeCart);
module.exports = router;