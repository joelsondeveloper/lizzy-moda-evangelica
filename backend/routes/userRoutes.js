const express = require("express");
const {
    getUsersForAdmin,
    getUserById,
    deleteUser
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, admin, getUsersForAdmin);
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;