const Cart = require("../models/Cart");
const { populate } = require("../models/Category");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const populateCartItems = async (query) => {
  return query.populate({
    path: "items.product",
    populate: { path: "category", select: "name" },
  });
};

const getCart = async (req, res) => {
  try {
    let cart = await populateCartItems(Cart.findOne({ user: req.user._id }));
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
      cart = await populateCartItems(Cart.findOne({ user: req.user._id }));
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar carrinho" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Quantidade invalida" });
    }

    if (!size) {
      if (product.size && product.size.length > 0) {
        size = product.size[0];
      } else {
        return res.status(400).json({ message: "Tamanho invalido" });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Produto invalido" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produto nao encontrado" });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size });
    }

    await cart.save();

    const populatedCart = await populateCartItems(
      Cart.findOne({ user: req.user._id })
    );

    if (!populatedCart) {
      return res.status(500).json({
        message: "Erro ao adicionar ao carrinho após adicionar e popular",
      });
    }

    res.json(populatedCart);
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    res
      .status(500)
      .json({ message: "Erro ao adicionar ao carrinho", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  const { productId, quantity, size } = req.body;

  if (typeof quantity !== "number" || quantity < 0) {
    return res.status(400).json({
      message: "Quantidade invalida. Deve ser um numero maior ou igual a zero",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "ID do Produto invalido" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Carrinho nao encontrado" });
    }

    console.log("BODY:", req.body);
    console.log(
      "CART ITEMS:",
      cart.items.map((i) => ({
        product: i.product.toString(),
        size: i.size,
        qty: i.quantity,
      }))
    );

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Item nao encontrado no carrinho" });
    }
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      if (size) {
        cart.items[itemIndex].size = size;
      }
    }
    await cart.save();

    const populatedCart = await populateCartItems(
      Cart.findOne({ user: req.user._id })
    );

    res.json(populatedCart);
  } catch (error) {
    console.error("Erro ao atualizar item do carrinho:", error);
    res.status(500).json({ message: "Erro ao atualizar item do carrinho" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "ID do Produto invalido" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Carrinho nao encontrado" });
    }

    const initialItemCount = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId || item.size !== size
    );

    if (cart.items.length === initialItemCount) {
      return res
        .status(404)
        .json({ message: "Item nao encontrado no carrinho" });
    }

    await cart.save();

    const populateCart = await populateCartItems(
      Cart.findOne({ user: req.user._id })
    );

    res.json(populateCart);
  } catch (error) {
    console.error("Erro ao remover do carrinho:", error);
    res.status(500).json({ message: "Erro ao remover do carrinho" });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(200).json({ user: req.user._id, items: [] });
    }
    cart.items = [];
    await cart.save();

    const populateCart = await populateCartItems(
      Cart.findOne({ user: req.user._id })
    );

    res.json(populateCart);
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
    res.status(500).json({ message: "Erro ao limpar carrinho" });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
};
