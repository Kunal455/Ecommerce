const express = require("express");
const router = express.Router();
const { getConfig, updateHeroSlides } = require("../controllers/ConfigController");
const { protect, admin } = require("../Middleware/authMiddleware");

router.route("/").get(getConfig);
router.route("/hero").put(protect, admin, updateHeroSlides);

module.exports = router;
