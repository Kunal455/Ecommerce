const Checkout = require("../models/Checkout");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");



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

    // Ensure payment is completed
    if (!checkout.isPaid) {
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

module.exports = { createCheckout, payCheckout, finalizeCheckout, getCheckoutById };