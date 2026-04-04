const express = require("express");
const cors = require("cors");
const colors = require('colors')
const dotenv = require("dotenv");
const connectDB = require("./config/db");
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
dotenv.config();

// connect to mongo
connectDB()


const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"], 
  credentials: true
}));

app.use((req, res, next) => {
  console.log(req.method, req.url);
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
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.bgBlue);
});