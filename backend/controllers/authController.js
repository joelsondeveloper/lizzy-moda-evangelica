const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const sendVerificationCode = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Código de verificação - Lizzy Moda Evangélica",
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #8C2D4B;">Olá!</h2>
            <p>Obrigado por se cadastrar na Lizzy Moda Evangélica.</p>
            <p>Por favor, use o código abaixo para verificar seu email e ativar sua conta:</p>
            <h3 style="color: #8C2D4B; font-size: 24px; text-align: center; border: 1px solid #eee; padding: 10px; border-radius: 5px;">
                ${code}
            </h3>
            <p>Este código é válido por 15 minutos.</p>
            <p>Se você não solicitou este código, por favor ignore este email.</p>
            <p>Atenciosamente,</p>
            <p>Equipe Lizzy Moda Evangélica</p>
        </div>
    `, // Melhor usar HTML
  };

  await transporter.sendMail(mailOptions);
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor preencha todos os campos" });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: "Usuario ja cadastrado" });
    }

    const verificationCode = Math.floor(
      1000000 + Math.random() * 9000000
    ).toString();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      isVerified: false,
      verificationCode,
      codeExpiresAt,
    });

    await sendVerificationCode(normalizedEmail, verificationCode);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      message: "Código de verificação enviado para o seu email",
    });
    // } else {
    //   res.status(400).json({ message: "Erro ao criar usuario" });
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const verifyUser = async (req, res) => {
  const { email, code } = req.body;

  // debug
  console.log(email, code);

  if (!email || !code) {
    return res
      .status(400)
      .json({ message: "Por favor preencha todos os campos" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Usuario ja verificado" });
    }

    if (user.verificationCode !== code) {
      return res
        .status(400)
        .json({ message: "Codigo de verificacao invalido" });
    }

    if (user.codeExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "Codigo de verificacao expirado" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.codeExpiresAt = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Usuario verificado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor preencha todos os campos" });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Usuario nao verificado" });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const getMe = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      isVerified: req.user.isVerified,
    });
  } else {
    res.status(404).json({ message: "Usuario nao encontrado" });
  }
};

const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Deslogado com sucesso" });
};

module.exports = { registerUser, authUser, getMe, logoutUser, verifyUser };
