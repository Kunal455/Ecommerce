const express = require("express");
const cors = require("cors");
const colors = require('colors')
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { initRedis } = require("./config/redis");
const userRouter = require('./routes/userRouter')
const ProductRouter = require('./routes/ProductRoute')
const CartRouter = require('./routes/CartRoutes')
const checkoutRoutes = require('./routes/checkoutRoutes')
const orderRoutes = require("./routes/OrderRoute");
const uploads = require('./routes/UploadRoutes')
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/adminRoute");
const adminProductRoutes = require("./routes/productAdminRoute");
const adminOrderRoute = require("./routes/adminOrderRouter");
const configRoutes = require("./routes/ConfigRoute");
dotenv.config();

// connect to mongo
connectDB()

// connect to redis
initRedis()


const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  }, 
  credentials: true
}));

const crypto = require('crypto');
const SERVER_ID = process.env.HOSTNAME || process.pid;

app.use((req, res, next) => {
  if (process.env.PERF_LOG === 'true') {
    req.requestId = crypto.randomUUID();
    req.perf = { 
      start: performance.now(),
      steps: {}
    };

    res.on('finish', () => {
      const totalDuration = performance.now() - req.perf.start;
      const threshold = Number(process.env.PERF_SLOW_THRESHOLD) || 0;
      
      if (totalDuration >= threshold) {
        const isError = res.statusCode >= 400;
        const prefix = isError ? '[PERF ERROR]' : '[API PERF]';
        console.log(`${prefix} ${req.method} ${req.originalUrl || req.url} status=${res.statusCode} duration=${totalDuration.toFixed(2)}ms server=${SERVER_ID} requestId=${req.requestId}`);
      }
    });
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Ecommerce");
});


app.use("/api/v3/user", userRouter )
app.use("/api/v3/product",  ProductRouter)
app.use("/api/v3/cart", CartRouter)
app.use("/api/v3/checkout", checkoutRoutes);
app.use("/api/v3/order", orderRoutes);
app.use("/api/v3/upload", uploads)
app.use("/api/v3", subscriberRoutes);
//admin
app.use("/api/v3/admin/users", adminRoutes);
app.use("/api/v3/admin/products", adminProductRoutes);
app.use("/api/v3/admin/orders", adminOrderRoute);
app.use("/api/v3/config", configRoutes);
const PORT = process.env.PORT || 8001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.bgBlue);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed.');
    }
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);