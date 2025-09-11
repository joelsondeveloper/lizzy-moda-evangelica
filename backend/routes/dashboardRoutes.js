const express = require("express");
const { getDashboardMetrics } = require("../controllers/dashboardController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, admin, getDashboardMetrics);

module.exports = router;