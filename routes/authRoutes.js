// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, getMe, cambiarPassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/cambiar-password', authenticate, cambiarPassword);

module.exports = router;
