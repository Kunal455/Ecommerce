const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(   //create a token
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
