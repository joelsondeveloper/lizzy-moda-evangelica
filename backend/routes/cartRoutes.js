const express = require("express");
const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
} = require("../controllers/cartController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, getCart)
  .post(protect, addToCart)
  .put(protect, updateCartItem)
  .delete(protect, clearCart);

router.route("/:productId/:size").delete(protect, removeFromCart);

module.exports = router;
