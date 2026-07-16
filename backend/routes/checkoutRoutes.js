const express = require("express");
const router = express.Router();

const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

const { protect } = require("../Middleware/authMiddleware");
const { createCheckout, payCheckout, finalizeCheckout, getCheckoutById, createRazorpayOrder } = require("../controllers/CheckoutController");

router.post("/", protect, createCheckout);
router.post("/create-razorpay-order", protect, createRazorpayOrder);
router.get("/:id", protect, getCheckoutById);
router.put("/:id/pay", protect, payCheckout);
router.post("/:id/finalize", protect, finalizeCheckout);
module.exports = router;