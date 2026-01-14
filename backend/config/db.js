const mongoose = require("mongoose");
const colors = require('colors')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully".bgBlue);
  } catch (error) {
    console.error("MongoDB connection failed:".bgRed, error);
    process.exit(1);
  }
};

module.exports = connectDB;
