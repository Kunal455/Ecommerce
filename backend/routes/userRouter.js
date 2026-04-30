const express = require("express")
const {
  registerUser,
  loginUser,
  forgotPassword,
  logoutUser,
  getUserDetails
}  = require('../controllers/userController')
const { protect } = require("../Middleware/authMiddleware");
const Router = express.Router()

Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.post("/forgot-password", forgotPassword);
Router.post("/logout", logoutUser);
Router.get("/me", protect, getUserDetails);

module.exports = Router