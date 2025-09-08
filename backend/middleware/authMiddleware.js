const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Não autorizado, token nao fornecido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();

  } catch (error) {
    console.log("error:", error);
    res.status(401).json({ message: "Nao autorizado, token invalido ou expirado" });
  }
};

module.exports = protect;