const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    email,
    password: hashedPassword,
    username,
  });

  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // Generate token
  const token = jwt.sign({ id: user._id }, 'secretKey');
  res.status(200).json({ token });
});

module.exports = router;

