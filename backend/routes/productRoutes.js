const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// middlewares
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, upload.array('images', 5), admin, createProduct);
router.put("/:id", protect, upload.array('images', 5), admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
