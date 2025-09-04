const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
        console.log("Nao autorizado, token nao fornecido");
      return res
        .status(401)
        .json({ message: "Não autorizado, token nao fornecido" });
    }

    console.log("Token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);

    req.user = await User.findById(decoded.id).select("-password");

    console.log("User:", req.user);

    next();

  } catch (error) {
    console.log("error:", error);
    res.status(401).json({ message: "Nao autorizado, token invalido ou expirado" });
  }
};

module.exports = protect;