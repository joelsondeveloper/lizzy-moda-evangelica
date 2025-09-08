const express = require('express');
const { registerUser, authUser, getMe, logoutUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);

module.exports = router;