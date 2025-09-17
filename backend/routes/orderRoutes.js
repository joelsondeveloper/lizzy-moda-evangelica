const express = require("express");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  createOrder,
  getUserOrders,
  getOrdersForAdmin,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders);
router.get("/admin", protect, admin, getOrdersForAdmin);
router.get("/:id", protect, getOrderById);
router.put("/:id", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
