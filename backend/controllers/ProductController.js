const Product = require("../models/Product");


const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku
    } = req.body;

    // Validation
    if (!name || !price || !countInStock) {
      return res.status(400).json({
        message: "Name, price and stock required",
      });
    }

    // SKU check
    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res.status(400).json({ message: "SKU exists" });
      }
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = { createProduct };
