const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
};

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
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, size, category, inStock } = req.body;
    const imageUrl = req.file.path;

    const product = new Product({
      name,
      description,
      price,
      size,
      category,
      imageUrl,
      inStock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name = "",
      description = "",
      price = 0,
      size = [],
      category = "",
      inStock = true,
    } = req.body || {};

    const product = await Product.findById(req.params.id);

    console.log(req.body);

    if (!product) {
      return res.status(404).json({ message: "Produto nao encontrado" });
    }

    if (req.file) {
      if (product.imageUrl) {
        const urlParts = product.imageUrl.split("/upload/");

        const publicId = urlParts[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId);
      }
      product.imageUrl = req.file.path;
    }

    const parsedSize = typeof size === "string" ? size.split(",") : size;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.size = parsedSize || product.size;
    product.category = category || product.category;
    product.inStock = inStock ?? product.inStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar produto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produto nao encontrado" });
    }
    if (product.imageUrl) {
      const urlParts = product.imageUrl.split("/upload/");

      const publicId = urlParts[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, "");

      await cloudinary.uploader.destroy(publicId);
    }

    await product.deleteOne();
    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao remover produto" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
