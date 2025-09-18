const User = require("../models/User");

const getUsersForAdmin = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Acesso restrito para administradores" });
        }
        const users = (await User.find({}).select("-password")).sort({createdAt: -1});
        res.json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        if (!req.user.isAdmin && user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Acesso restrito. Apenas administradores podem ver outros usuários" });
        }
        res.json(user);
    } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Acesso restrito. Apenas administradores podem deletar usuários" });
        }
        if (user.isAdmin) {
            return res.status(403).json({ message: "Não é possível deletar um administrador" });
        }
        await User.deleteOne({ _id: id });
        res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ message: "Erro ao deletar usuário", error: error.message });
    }
};

module.exports = { getUsersForAdmin, getUserById, deleteUser };