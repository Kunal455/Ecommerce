const express = require("express");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { protect, admin } = require("../Middleware/authMiddleware");

// Upload route
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    // Stream upload function
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "ecommerce_products" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        // convert buffer → stream
        streamifier.createReadStream(fileBuffer).pipe(stream);

      });
    };

    // Upload image
    const result = await streamUpload(req.file.buffer);

    // Send image URL to client
    res.json({
      imageUrl: result.secure_url
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
});

module.exports = router;