const express = require("express");
const cors = require("cors");
const colors = require('colors')
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require('./routes/userRouter')

dotenv.config();

// connect to mongo
connectDB()


const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Ecommerce");
});


app.use("/api/v3/user", userRouter )

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.bgBlue);
});
