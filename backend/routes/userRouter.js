const express = require("express")
const {
  registerUser,
  loginUser,
  forgotPassword,
  logoutUser,
  getUserDetails,
  updateUserProfile,
  googleAuth
}  = require('../controllers/userController')
const { protect } = require("../Middleware/authMiddleware");
const Router = express.Router()

Router.post("/register", registerUser);
Router.post("/login", loginUser); 
Router.post("/google", googleAuth);
Router.post("/forgot-password", forgotPassword);
Router.post("/logout", logoutUser);
Router.get("/me", protect, getUserDetails);
Router.put("/profile", protect, updateUserProfile);

module.exports = Router