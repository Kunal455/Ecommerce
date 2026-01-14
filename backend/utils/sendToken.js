const generateToken = require("./generateToken");

const sendToken = (user, res, statusCode) => {
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(statusCode).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

module.exports = sendToken;
