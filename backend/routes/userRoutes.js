const express = require('express');
const router = express.Router();

// Import the controller functions
const { registerUser, loginUser } = require('../controllers/userController');

// @route   POST /api/users/signup
// @access  Public
router.post('/signup', registerUser);

// @route   POST /api/users/login
// @access  Public
router.post('/login', loginUser);

module.exports = router;
