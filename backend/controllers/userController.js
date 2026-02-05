const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendToken = require("../utils/sendToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // ✅ single response
    sendToken(user, res, 201);

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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


const foregtpassword = async(req, res) =>{
  const {email, password} = req.body;

  if(!email || !password){
    res.status(401).json({
      message: "please fill the email or new Password field"
    })
    user = User.findOne({email})
    user.findbyIdandUodate



  }
}
module.exports = { registerUser, loginUser };

