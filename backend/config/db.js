const mongoose = require("mongoose");
const colors = require('colors')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      maxPoolSize: 100, // Handle up to 100 concurrent connections in pool
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("MongoDB connected successfully".bgBlue);
  } catch (error) {
    console.error("MongoDB connection failed:".bgRed, error);
    process.exit(1);
  }
};

module.exports = connectDB;
