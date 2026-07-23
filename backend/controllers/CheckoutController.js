const Checkout = require("../models/Checkout");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");

let globalRazorpayKeyId = process.env.RAZORPAY_KEY_ID;
let globalRazorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
let razorpay = new Razorpay({
  key_id: globalRazorpayKeyId,
  key_secret: globalRazorpayKeySecret,
});



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

    // 3.5️⃣ Verify Razorpay Signature if payment method is Razorpay
    if (checkout.paymentMethod === "Razorpay" && paymentDetails && paymentDetails.razorpay_signature) {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentDetails;
      
      const envPath = path.resolve(__dirname, "../.env");
      let activeSecret = process.env.RAZORPAY_KEY_SECRET || "secret_placeholder";
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        if (envConfig.RAZORPAY_KEY_SECRET && envConfig.RAZORPAY_KEY_SECRET !== "secret_placeholder") {
          activeSecret = envConfig.RAZORPAY_KEY_SECRET;
        }
      }

      if (activeSecret !== "secret_placeholder") {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac("sha256", activeSecret)
          .update(body.toString())
          .digest("hex");

        if (expectedSignature !== razorpay_signature) {
          return res.status(400).json({ message: "Invalid payment signature" });
        }
      }
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

const createRazorpayOrder = async (req, res) => {
  try {
    const { checkoutId } = req.body;
    
    const checkout = await Checkout.findById(checkoutId);
    
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Safely load the key from .env file or process.env
    let activeKeyId = globalRazorpayKeyId;
    let activeKeySecret = globalRazorpayKeySecret;
    try {
      const envPath = path.resolve(__dirname, "../.env");
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        if (envConfig.RAZORPAY_KEY_ID && envConfig.RAZORPAY_KEY_ID !== "rzp_test_placeholder") {
          activeKeyId = envConfig.RAZORPAY_KEY_ID;
          activeKeySecret = envConfig.RAZORPAY_KEY_SECRET;
          razorpay = new Razorpay({
            key_id: activeKeyId,
            key_secret: activeKeySecret,
          });
        }
      }
    } catch (e) {
      console.error("Error reading .env dynamically:", e);
    }

    // Bypass Razorpay if no valid key is provided
    if (!activeKeyId || activeKeyId === "rzp_test_placeholder" || activeKeyId.includes("placeholder")) {
      return res.status(200).json({
        id: "order_dummy_for_testing",
        amount: Math.round(checkout.totalPrice * 100),
        currency: "INR",
      });
    }

    const options = {
      amount: Math.round(checkout.totalPrice * 100), // amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${checkout._id}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = { createCheckout, payCheckout, finalizeCheckout, getCheckoutById, createRazorpayOrder };