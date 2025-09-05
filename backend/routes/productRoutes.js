const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// middlewares
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, upload.single("image"), admin, createProduct);
router.put("/:id", protect, upload.single("image"), admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
