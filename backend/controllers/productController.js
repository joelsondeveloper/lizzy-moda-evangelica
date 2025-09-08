const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Produto nao encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar produto" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, size, category, inStock } = req.body;
    const imageUrl = req.file ? req.file.path : "";

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Categoria invalida" });
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Categoria nao encontrada" });
    }

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
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao criar produto", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, size, category, inStock } = req.body;

    const product = await Product.findById(req.params.id);

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

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res
          .status(400)
          .json({ message: "ID da categoria inválido para atualização." });
      }
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(400).json({
          message:
            "Categoria não encontrada com o ID fornecido para atualização.",
        });
      }
      product.category = category;
    }

    product.name = name !== undefined ? name : product.name;
    product.description =
      description !== undefined ? description : product.description;
    product.price = price !== undefined ? price : product.price;

    if (size !== undefined) {
      product.size =
        typeof size === "string" ? size.split(",").map((s) => s.trim()) : size;
    }

    product.inStock = inStock !== undefined ? inStock : product.inStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao atualizar produto", error: error.message });
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

      if (urlParts.length > 1 && urlParts[1]) {
        const publicId = urlParts[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, "");

        if (publicId) {
          try {
            
            await cloudinary.uploader.destroy(publicId);
            console.log(`Imagem do produto ${product._id} excluida do Cloudinary.`);

          } catch (error) {
            console.error(
              `Erro ao excluir imagem do produto ${product._id} do Cloudinary: ${error}`,
              error
            )
          }
        }
      }
    } else {
      console.warn(
        `URL da imagem do produto ${product._id} não está no formato esperado do Cloudinary para exclusão: ${product.imageUrl}. Ignorando exclusão do Cloudinary.`
      );
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
