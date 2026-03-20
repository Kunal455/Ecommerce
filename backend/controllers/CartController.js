const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } 
  else if (guestId) {
    return await Cart.findOne({ guestId: guestId });
  }
  return null;
};



const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    // 1️⃣ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2️⃣ Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // 3️⃣ If cart doesn't exist → create new one
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        products: [],
      });
    }

    // 4️⃣ Check if product already exists in cart
    const productIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (productIndex > -1) {
      // 5️⃣ If exists → update quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // 6️⃣ If not → add new item
      cart.products.push({
        productId,
        name: product.name,
        image: product.images?.[0]?.url,
        price: product.price,
        size,
        color,
        quantity,
      });
    }

    // 7️⃣ Save cart
    await cart.save();

    // 8️⃣ Return updated cart
    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
    
  }
};





const updateCart = async (req, res) => {
  const { productId, quantity, size, color, guestId } = req.body;

  try {

   
    const query = req.user ? { user: req.user._id } : { guestId: guestId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

   
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    // remove product from cart
    cart.products = cart.products.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
        )
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

const getUserCart = async (req, res) => {
  try {
    const { guestId } = req.query;

    const cart = await getCart(req.user ? req.user._id : null, guestId);

    if (cart) {
      return res.status(200).json({
        success: true,
        cart
      });
    }

    res.status(404).json({
      success: false,
      message: "Cart not found"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


const mergeCart = async (req, res) => {
  const { guestId } = req.body;

  try {
    // Find guest cart
    const guestCart = await Cart.findOne({ guestId });

    // Find logged-in user's cart
    let userCart = await Cart.findOne({ user: req.user._id });

    // If guest cart doesn't exist
    if (!guestCart) {
      return res.status(200).json({
        success: true,
        message: "No guest cart found",
        cart: userCart
      });
    }

    // If user cart doesn't exist → convert guest cart into user cart
    if (!userCart) {
      guestCart.user = req.user._id;
      guestCart.guestId = undefined;

      await guestCart.save();

      return res.status(200).json({
        success: true,
        message: "Guest cart assigned to user",
        cart: guestCart
      });
    }

    // Merge products
    guestCart.products.forEach((guestItem) => {

      const index = userCart.products.findIndex(
        (item) =>
          item.productId.toString() === guestItem.productId.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      );

      if (index > -1) {
        userCart.products[index].quantity += guestItem.quantity;
      } else {
        userCart.products.push(guestItem);
      }

    });

    await userCart.save();

    // Delete guest cart
    await Cart.findOneAndDelete({ guestId });

    res.status(200).json({
      success: true,
      message: "Cart merged successfully",
      cart: userCart
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = { addToCart, updateCart, deleteCartItem, getUserCart, mergeCart };