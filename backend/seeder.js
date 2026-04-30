// backend/seeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/user");
const products = require("./Data/products.js");
const Cart = require("./models/Cart.js")
dotenv.config();

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URL); // Note: Use MONGO_URL not MONGO_URI

// Function to seed data
const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        // Create a default admin User
        const createdUser = await User.create({
            firstName: "Kunal",
            lastName: "Kumar",
            email: "kk6547015@gmail.com",
            password: "1234567890",
            role: "admin",
        });

        const userID = createdUser._id;

        // Add userID to each product
        const sampleProducts = products.map((product) => {
            return { ...product, user: userID }; // Note: use "user" not "userID" (matches your schema)
        });

        // Insert the products into the database
        await Product.insertMany(sampleProducts);

        console.log("✅ Product data seeded successfully!");
        console.log(`👤 Admin created: ${createdUser.email}`);
        console.log(`📦 Products added: ${sampleProducts.length}`);
        
        process.exit();

    } catch (error) {
        console.error("❌ Error seeding the data:", error);
        process.exit(1);
    }
};

seedData();