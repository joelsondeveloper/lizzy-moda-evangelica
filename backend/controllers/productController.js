const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produtos" });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Produto nao encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produto" });
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, size, category, imageUrl, inStock } = req.body;

        const product = new Product({
            name,
            description,
            price,
            size,
            category,
            imageUrl,
            inStock
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch (error) {
        res.status(500).json({ message: "Erro ao criar produto" });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, size, category, imageUrl, inStock } = req.body;

        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.size = size || product.size;
            product.category = category || product.category;
            product.imageUrl = imageUrl || product.imageUrl;
            product.inStock = inStock ?? product.inStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Produto nao encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar produto" });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: "Produto removido com sucesso" });
        } else {
            res.status(404).json({ message: "Produto nao encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover produto" });
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}