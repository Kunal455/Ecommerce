const Order = require("../models/Order");

// @desc Get all orders (Admin)
// @route GET /api/admin/orders
// @access Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email"); // optional (good practice)

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // update status
    order.status = req.body.status || order.status;

    // if delivered
    if (req.body.status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order updated successfully",
      updatedOrder,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};


const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // check if order exists
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await order.deleteOne();

    res.status(200).json({
      message: "Order deleted successfully",
      deletedOrder: {
        _id: order._id,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};



module.exports = { getAllOrders, updateOrderStatus, deleteOrder };