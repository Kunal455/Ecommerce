const generateToken = require("./generateToken");

const sendToken = (user, res, statusCode) => {
  const token = generateToken(user._id);

  console.log(token)

  // set cookie (secure way)
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // ALSO return token in response body
  res.status(statusCode).json({
    success: true,
    token, // 👈 NOW YOU GET TOKEN
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  });
};

module.exports = sendToken;

