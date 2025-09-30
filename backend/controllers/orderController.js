const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

const populateOrderDetails = (query) => {
  return query.populate("user", "name email").populate({
    path: "items.product",
    select: "name imageUrl price",
    populate: { path: "category", select: "name" },
  });
};

const getOrdersByUserId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de usuário inválido" });
        }

        if (!req.user.isAdmin && req.user._id.toString() !== id.toString()) {
            return res.status(403).json({ message: "Acesso restrito. Apenas administradores podem ver outros usuários" });
        }

        const orders = await populateOrderDetails(Order.find({ user: id }).sort({ createdAt: -1 }));

        res.json(orders);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.status(500).json({ message: "Erro ao buscar pedidos" });
    }
}

const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ message: "Carrinho vazio, nenhum pedido criado" });
    }

    let totalPrice = 0;
    const orderItemsForCreation = [];

    for (const item of cart.items) {
      if (
        !item.product ||
        !item.product.price ||
        isNaN(item.product.price) ||
        item.product.price <= 0
      ) {
        return res
          .status(400)
          .json({
            message: `um produto no carrinho (${
              item.product ? item.product.name : "ID" + item.product._id
            }) tem preço inválido`,
          });
      }
      totalPrice += item.product.price * item.quantity;
      orderItemsForCreation.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
      });
    }

    const message = cart.items
      .map((item) => {
        const productName = item.product
          ? item.product.name
          : "Produto Desconhecido";
        const itemPrice = item.product ? item.product.price : 0;
        return `${item.quantity}x ${productName} (Tamanho: ${
          item.size || "N/A"
        }) - R$${(itemPrice * item.quantity).toFixed(2)}`;
      })
      .join("\n");

    const order = await Order.create({
      user: req.user._id,
      items: orderItemsForCreation,
      totalPrice,
    });

    cart.items = [];
    await cart.save();

    const whatsappLink = `https://wa.me/5581987612791?text=Olá,%20quero%20fazer%20este%20pedido:%0A${encodeURIComponent(
      message
    )}%0ATotal:%20R$${totalPrice.toFixed(2)}`;

    const populateOrder = await populateOrderDetails(Order.findById(order._id));

    res.status(201).json({ order: populateOrder, whatsappLink });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res
      .status(500)
      .json({ message: "Erro ao criar pedido", error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await populateOrderDetails(
      Order.find({ user: req.user._id })
    );
    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar pedidos", error: error.message });
  }
};

const getOrdersForAdmin = async (req, res) => {
  try {
    let ordersQuery;

    if (req.user && req.user.isAdmin) {
      ordersQuery = Order.find();
    } else {
      return res
        .status(401)
        .json({ message: "Acesso restrito para administradores" });
    }

    const orders = await populateOrderDetails(
      ordersQuery.sort({ createdAt: -1 })
    );
    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar pedidos", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await populateOrderDetails(Order.findById(id));

    if (!order) {
      return res.status(404).json({ message: "Pedido nao encontrado" });
    }

    if (
      !req.user.isAdmin &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({
          message:
            "Acesso nao autorizado. Apenas administradores podem ver pedidos de outros usuários",
        });
    }

    res.json(order);
  } catch (error) {
    console.error("Erro ao buscar pedido por ID:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar pedido", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pendente", "confirmado", "cancelado"].includes(status)) {
      return res.status(400).json({ message: "Status de pedido invalido" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido nao encontrado" });
    }

    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          message:
            "Acesso nao autorizado. Apenas administradores podem atualizar status de pedidos",
        });
    }

    order.status = status;
    await order.save();

    const populateOrder = await populateOrderDetails(Order.findById(id));

    res.json(populateOrder);
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    res
      .status(500)
      .json({
        message: "Erro ao atualizar status do pedido",
        error: error.message,
      });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido nao encontrado" });
    }

    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          message:
            "Acesso nao autorizado. Apenas administradores podem deletar pedidos",
        });
    }

    await Order.deleteOne();

    res.json({ message: "Pedido deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    res
      .status(500)
      .json({ message: "Erro ao deletar pedido", error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrdersForAdmin,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrdersByUserId
};
