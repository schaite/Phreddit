const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/Users');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post('/register', async (req, res) => {
  const { email, displayName, firstName, lastName, password, confirmPassword } = req.body;

  // Validate required fields
  if (!email || !displayName || !firstName || !lastName || !password || !confirmPassword) {
    return res.status(400).json({ 
      message: 'Email, displayName, firstName, lastName, and password are required.' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Validate matching passwords
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  // Validate password restrictions
  const containsInvalidSubstring = [displayName, email, firstName, lastName].some(
    (value) => value && password.toLowerCase().includes(value.toLowerCase())
  );

  if (containsInvalidSubstring) {
    return res.status(400).json({
      message: 'Password should not contain your email, display name, first name, or last name.',
    });
  }

  try {
    // Check for duplicate email or display name
    const existingUser = await User.findOne({
      $or: [{ email }, { displayName }],
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Display Name already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({
      email,
      displayName,
      firstName,
      lastName,
      hashedPassword,
      memberSince: memberSince || Date.now(), // Use provided date or default to current date
    });

    await newUser.save();
    res.status(201).json({ message: 'Account created successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// POST - User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user || !user.hashedPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Login successful
    res.json({
      message: 'Login successful.',
      user: { id: user._id, displayName: user.displayName, email: user.email },
    });
  } catch (err) {
    console.error('Error during login:', err.message); // Log for debugging
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// PUT (update) an existing user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, displayName, firstName, lastName, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }

  const updates = {};
  if (email) updates.email = email;
  if (displayName) updates.displayName = displayName;
  if (firstName) updates.firstName = firstName; // Ensure firstName is updated
  if (lastName) updates.lastName = lastName;   // Ensure lastName is updated
  if (password) updates.hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email or Display Name already exists.' });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});


// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
