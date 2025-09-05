const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Carrinho vazio' });
        }

        let totalPrice = 0;
        cart.items.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        const message = cart.items
            .map(item => `${item.quantity}x ${item.product.name} - R$${(item.product.price * item.quantity).toFixed(2)}`)
            .join('\n');

        const order = await Order.create({
            user: req.user._id,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            totalPrice,
        });

        cart.items = [];
        await cart.save();

        const whatsappLink = `https://wa.me/5581987612791?text=Olá,%20quero%20fazer%20este%20pedido:%0A${encodeURIComponent(message)}%0ATotal:%20R$${totalPrice.toFixed(2)}`;

        res.status(201).json({ order, whatsappLink });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar pedido' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
};