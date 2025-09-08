const mongoose = require("mongoose");
const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingCategory) {
      return res
        .status(409)
        .json({ message: "Já existe uma categoria com este nome." });
    }
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Erro ao criar categoria" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar categorias" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "ID da categoria inválido para atualização." });
    }
    if (name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: id },
      });
      if (existingCategory) {
        return res
          .status(409)
          .json({ message: "Já existe outra categoria com este nome." });
      }
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Categoria nao encontrada" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(400).json({ message: "Erro ao atualizar categoria" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "ID da categoria inválido para remoção." });
    }
    const Product = require("../models/Product");
    const productUsingCategory = await Product.countDocuments({ category: id });

    if (productUsingCategory > 0) {
      return res
        .status(400)
        .json({ message: `Categoria em uso por ${productUsingCategory} produtos` });
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Categoria nao encontrada" });
    }
    res.status(200).json({ message: "Categoria removida com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao remover categoria" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
