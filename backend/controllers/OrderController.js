const Order = require("../models/Order");

// @desc Get logged-in user's orders
// @route GET /api/orders/my-orders
// @access Private

const getMyOrders = async (req, res) => {
  try {

    // find orders of logged-in user
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};


const getOrderById = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};


module.exports = { getMyOrders, getOrderById };