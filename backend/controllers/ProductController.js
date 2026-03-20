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


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        message: "Product not found" 
      });
    }

    // Check if user is admin or product owner
    if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Not authorized to update this product" 
      });
    }

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

    // Check if SKU is being changed and if it already exists
    if (sku && sku !== product.sku) {
      const existingSku = await Product.findOne({ sku, _id: { $ne: id } });
      if (existingSku) {
        return res.status(400).json({ 
          message: "SKU already exists" 
        });
      }
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.sizes = sizes || product.sizes;
    product.colors = colors || product.colors;
    product.collections = collections || product.collections;
    product.material = material || product.material;
    product.gender = gender || product.gender;
    product.images = images || product.images;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
    product.tags = tags || product.tags;
    product.dimensions = dimensions || product.dimensions;
    product.weight = weight || product.weight;
    product.sku = sku || product.sku;

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
};



const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    
    const product = await Product.findById(id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ 
        message: "Product not found" 
      });
    }

   
    if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Not authorized to delete this product" 
      });
    }

    
    await product.deleteOne();

    res.status(200).json({ 
      message: "Product deleted successfully",
      deletedProduct: {
        _id: product._id,
        name: product.name
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
};





const getProducts = async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
      page
    } = req.query;

    let query = {};

    // 🔎 Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (size) query.sizes = size;
    if (color) query.colors = color;
    if (material) query.material = material;
    if (gender) query.gender = gender;
    if (collection) query.collections = collection;

    // 💰 Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 🔄 Sorting
    let sortOption = {};
    if (sortBy === "price_asc") sortOption.price = 1;
    if (sortBy === "price_desc") sortOption.price = -1;
    if (sortBy === "newest") sortOption.createdAt = -1;

    // 📄 Pagination
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    
    console.log("Query Object:", query);

    const products = await Product.find(query).sort(sortOption).skip(skip).limit(pageSize);

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / pageSize),
      products
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json(product);

  } catch (error) {
    
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    res.status(500).json({ message: "Server Error" });
  }
};



const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;

   
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    const similarProducts = await Product.find({
      _id: { $ne: id }, 
      category: product.category,
      gender: product.gender
    })
      .limit(4); 

    res.status(200).json({
      success: true,
      count: similarProducts.length,
      similarProducts
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const bestSeller = await Product.findOne()
      .sort({ rating: -1 }); 

    if (!bestSeller) {
      return res.status(404).json({
        message: "No best seller found"
      });
    }

    res.status(200).json({
      success: true,
      bestSeller
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 }) 
      .limit(8); 

    res.status(200).json({
      success: true,
      count: newArrivals.length,
      newArrivals
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};



module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getSimilarProducts,
  getBestSellers,
  getNewArrivals
};
