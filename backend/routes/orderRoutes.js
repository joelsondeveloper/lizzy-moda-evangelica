const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createOrder,
  getUserOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders);

module.exports = router;
