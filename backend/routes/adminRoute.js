
const express = require("express");
const { getAllUsers, createUser, updateUser, deleteUser } = require("../controllers/AdminController");
const { protect, admin } = require("../Middleware/authMiddleware");

const router = express.Router();

// GET /api/admin/users
router.get("/", protect, admin, getAllUsers);
router.post("/", protect, admin, createUser);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);
module.exports = router;
