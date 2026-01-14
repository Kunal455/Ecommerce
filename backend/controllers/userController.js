const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sendToken = require("../utils/sendToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    user = new User({ name, email, password });
    await user.save();

    sendToken(user, res, 201)
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });
    sendToken(user, res, 200);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

module.exports = {registerUser, loginUser};
