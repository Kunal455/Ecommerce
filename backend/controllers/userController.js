const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendToken = require("../utils/sendToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    user = new User({ name, email, password: hashedPassword });
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



const bcrypt = require("bcryptjs");
const User = require("../Model/User");
const sendToken = require("../utils/sendToken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendToken(user, res, 200);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {registerUser, loginUser};
