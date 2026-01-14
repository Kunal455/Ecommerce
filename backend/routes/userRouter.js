const express = require("express")
const {registerUser, loginUser} = require('../controllers/userController')
const Router = express.Router()
const {isLogin} = require("../Middleware/authMiddleware")

Router.post("/register", registerUser)
Router.post("/login", isLogin ,loginUser)


module.exports = Router