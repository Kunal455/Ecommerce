const express = require("express")
const {
  registerUser,
  loginUser,
  forgotPassword,
  logoutUser,
  getUsers,
  addUser,
  deleteUser
}  = require('../controllers/userController')
const { protect, admin } = require("../Middleware/authMiddleware");
const Router = express.Router()


Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.post("/forgot-password", forgotPassword);
Router.post("/logout", logoutUser);

// Admin Routes
Router.route("/")
  .get(protect, admin, getUsers)
  .post(protect, admin, addUser);

Router.route("/:id")
  .delete(protect, admin, deleteUser);

module.exports = Router