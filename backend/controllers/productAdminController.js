const Product = require("../models/Product");

// @desc Get all products (Admin Panel)
// @route GET /api/admin/products
// @access Private/Admin
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = { getAdminProducts };