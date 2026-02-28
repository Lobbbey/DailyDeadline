const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// @desc    Register a new user
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            username,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: { userId: user._id, username: user.username },
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Sign a user in
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: "Please provide username and password" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: true, token });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};
