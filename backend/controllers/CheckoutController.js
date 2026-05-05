const Checkout = require("../models/Checkout");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const Stripe = require("stripe");

let globalStripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
let stripe = new Stripe(globalStripeKey);



const createCheckout = async (req, res) => {
  try {
    const { checkoutItems, shippingAddress, paymentMethod } = req.body;

    // Validation
    if (!checkoutItems || checkoutItems.length === 0) {
      return res.status(400).json({
        message: "No items in checkout",
      });
    }

    // 1️⃣ Verify product details and calculate total price server-side
    let calculatedTotalPrice = 0;
    const validatedCheckoutItems = [];

    for (const item of checkoutItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      calculatedTotalPrice += itemPrice * item.quantity;

      validatedCheckoutItems.push({
        productId: item.productId,
        name: product.name,
        image: product.images?.[0]?.url || "",
        price: itemPrice,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      });
    }

    const checkout = await Checkout.create({
      user: req.user._id,
      checkoutItems: validatedCheckoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotalPrice,
    });

    res.status(201).json({
      success: true,
      checkout,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};



const payCheckout = async (req, res) => {
  try {

    const { paymentStatus, paymentDetails } = req.body;

    // 1️⃣ Find checkout
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found"
      });
    }

    // 2️⃣ Prevent double payment update
    if (checkout.isPaid) {
      return res.status(400).json({
        message: "Checkout already paid"
      });
    }

    // 3️⃣ Validate payment status
    if (paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Payment not successful"
      });
    }

    // 4️⃣ Update checkout payment fields
    checkout.isPaid = true;
    checkout.paidAt = Date.now();
    checkout.paymentStatus = paymentStatus;
    checkout.paymentDetails = paymentDetails;

    const updatedCheckout = await checkout.save();

    res.status(200).json({
      success: true,
      checkout: updatedCheckout
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};




const finalizeCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    // Checkout exists?
    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found",
      });
    }

    // Ensure payment is completed (unless it's Cash on Delivery)
    if (!checkout.isPaid && checkout.paymentMethod !== "Cash on Delivery") {
      return res.status(400).json({
        message: "Checkout not paid",
      });
    }

    // Prevent duplicate orders
    if (checkout.isFinalized) {
      return res.status(400).json({
        message: "Checkout already finalized",
      });
    }

    // Create order
    const order = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: checkout.isPaid,
      paidAt: checkout.paidAt,
      paymentStatus: checkout.paymentStatus,
    });

    // 1️⃣ Update product stock atomically
    for (const item of checkout.checkoutItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { countInStock: -item.quantity },
      });
    }

    // 2️⃣ Clear user's cart
    await Cart.findOneAndDelete({ user: checkout.user });

    // 3️⃣ Update checkout
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();

    await checkout.save();

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getCheckoutById = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (checkout) {
      res.status(200).json(checkout);
    } else {
      res.status(404).json({ message: "Checkout not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const { checkoutId, requestedMethod } = req.body;
    
    const checkout = await Checkout.findById(checkoutId);
    
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Safely load the key from .env file or process.env
    let activeKey = globalStripeKey;
    try {
      const envPath = path.resolve(__dirname, "../.env");
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        if (envConfig.STRIPE_SECRET_KEY && envConfig.STRIPE_SECRET_KEY !== "sk_test_placeholder") {
          activeKey = envConfig.STRIPE_SECRET_KEY;
          stripe = new Stripe(activeKey);
        }
      }
    } catch (e) {
      console.error("Error reading .env dynamically:", e);
    }

    // Bypass Stripe if no valid key is provided
    if (!activeKey || activeKey === "sk_test_placeholder" || activeKey.includes("placeholder")) {
      return res.status(200).json({
        clientSecret: "dummy_secret_for_testing"
      });
    }

    // Create a payment intent strictly locked to the user's requested method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(checkout.totalPrice * 100),
      currency: "inr",
      payment_method_types: [requestedMethod || "card"],
      metadata: {
        checkoutId: checkout._id.toString()
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = { createCheckout, payCheckout, finalizeCheckout, getCheckoutById, createCheckoutSession };