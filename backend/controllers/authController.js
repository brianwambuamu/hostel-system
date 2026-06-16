// backend/controllers/authController.js
const User = require('../models/User'); // Ensure you have a User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. SIGNUP LOGIC
exports.signup = async (req, res) => {
  try {
    const { name, regNumber, password, role } = req.body;

    // Validate if user already exists
    const userExists = await User.findOne({ regNumber: regNumber.toUpperCase() });
    if (userExists) {
      return res.status(400).json({ message: 'Registration number already registered.' });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to MongoDB
    const newUser = await User.create({
      name,
      regNumber: regNumber.toUpperCase(),
      password: hashedPassword,
      role: role || 'student' // Default role is student, can be 'warden'
    });

    // Generate JWT token for immediate login after signup
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, name: newUser.name, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// 2. LOGIN LOGIC
exports.login = async (req, res) => {
  try {
    const { regNumber, password } = req.body;

    // Find user by registration number
    const user = await User.findOne({ regNumber: regNumber.toUpperCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid registration number or password.' });
    }

    // Check if password matches hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid registration number or password.' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};