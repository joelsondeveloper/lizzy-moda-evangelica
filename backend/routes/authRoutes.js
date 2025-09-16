const express = require("express");
const {
  registerUser,
  authUser,
  getMe,
  logoutUser,
  verifyUser,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const passport = require("passport");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/me", protect, getMe);
router.post("/logout", logoutUser);
router.post("/verify", verifyUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/login",
    session: false,
  }),
  (req, res) => {
    const { user, token } = req.user;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,});
    const redirectUrl = user.admin ? process.env.FRONTEND_URL + "/admin" : process.env.FRONTEND_URL + "/";
    res.redirect(redirectUrl);
  }
);

module.exports = router;
