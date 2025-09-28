const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

const  extractPublicId = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.includes('/upload/')) {
    return null;
  }
  const urlParts = imageUrl.split('/upload/');
  if (urlParts.length > 1 && urlParts[1]) {
    return urlParts[1]
      .replace(/^v\d+\//, '')
      .replace(/\.[^/.]+$/, '');
  }
  return null;
};

const normalizeSizes = (size) => {
  if (!size) return [];
  if (Array.isArray(size)) return size.map(s => s.trim());
  if (typeof size === "string") {
    try {
      const parsed = JSON.parse(size);
      if (Array.isArray(parsed)) return parsed.map(s => s.trim());
    } catch (e) {
      return size.split(",").map(s => s.trim());
    }
  }
  return [];
};

const getProducts = async (req, res) => {
  try {
    const {
      displayType,
      categoryId,
      search,
      minPrice,
      maxPrice,
      size,
      page,
      limit
    } = req.query;
    let filter = {};
    let sort = {};
    let queryLimit = limit ? parseInt(limit) : 6;
    let skip = page ? (parseInt(page) - 1) * queryLimit : 0;

    if (displayType === 'novidade') {
      filter = { inStock: true };
      sort = { createdAt: -1 };
    } else if (displayType === 'destaque') {
      filter = { inStock: true };
      sort = { createdAt: -1 };
    } else if (displayType === 'promocao') {
      filter = { inStock: true };
      sort = { price: 1 };
    } else if (displayType === 'categoria' && categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Categoria invalida" });
      }
      filter.category = categoryId;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (!displayType && categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.category = categoryId;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }

    if (size) {
      const sizesArray = size.split(",").map((s) => s.trim());
      if (sizesArray.length > 0) {
        filter.size = { $in: sizesArray };
      }
    }

      filter.inStock = true
      
      let productQuery = Product.find(filter);

    if (Object.keys(sort).length > 0) {
      productQuery = productQuery.sort(sort);
    } else {
    productQuery = productQuery.sort({ createdAt: -1 })
    }

    const totalProducts = await Product.countDocuments(filter);

    productQuery = productQuery.skip(skip).limit(queryLimit);

    const products = await productQuery.populate("category", "name");
    res.json({products, totalProducts, productPerPage: queryLimit});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
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
    const imageUrls = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          imageUrls.push(result.secure_url);
        } catch (error) {
          console.error("Erro ao enviar imagem para Cloudinary:", error);
          return res
            .status(500)
            .json({ message: "Erro ao enviar imagem para Cloudinary" });
        }
      }
    } else {
      if (Product.schema.path("imageUrl").isRequired) {
        return res.status(400).json({ message: "Imagem obrigatoria" });
      }
    }

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
      size: normalizeSizes(size),
      category,
      imageUrl: imageUrls,
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

    const currentImageUrlsToKeep = req.body.currentImageUrls ? JSON.parse(req.body.currentImageUrls) : [];

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produto nao encontrado" });
    }

    const newImageUrls = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          newImageUrls.push(result.secure_url);
        } catch (error) {
          console.error("Erro ao enviar imagem para Cloudinary:", error);
          return res
            .status(500)
            .json({ message: "Erro ao enviar imagem para Cloudinary" });
        }
      }
    }

    const finalImageUrls = [...currentImageUrlsToKeep, ...newImageUrls];

    for (const oldUrl of product.imageUrl) {
      if (!finalImageUrls.includes(oldUrl)) {
          const publicId = extractPublicId(oldUrl);
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (error) {
              console.error("Erro ao excluir imagem da Cloudinary:", error);
              return res
                .status(500)
                .json({ message: "Erro ao excluir imagem da Cloudinary" });
            }
          }
      }
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
      product.size = normalizeSizes(size)
    }

    product.inStock = inStock !== undefined ? inStock : product.inStock;

    product.imageUrl = finalImageUrls;

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
    if (product.imageUrl && Array.isArray(product.imageUrl) && product.imageUrl.length > 0) {
      for (const imageUrl of product.imageUrl) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.error("Erro ao excluir imagem da Cloudinary:", error);
            return res
              .status(500)
              .json({ message: "Erro ao excluir imagem da Cloudinary" });
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
