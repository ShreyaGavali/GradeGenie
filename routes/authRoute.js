const express = require('express');
const { signup, login } = require('../controllers/authController.js');
const router = express.Router();

// POST /signup
router.post('/signup', signup);
router.post("/login", login);

module.exports = router;
