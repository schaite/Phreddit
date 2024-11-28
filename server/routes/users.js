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
router.post('/', async (req, res) => {
  const { email, displayName, firstName, lastName, password } = req.body;

  // Validate required fields
  if (!email || !displayName || !password) {
    return res.status(400).json({ message: 'Email, displayName, and password are required' });
  }

  // Hash the password
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      displayName,
      firstName,
      lastName,
      hashedPassword,
      reputation: 100, // Default reputation
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email or displayName already exists' });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

// PUT (update) an existing user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, displayName, firstName, lastName, password } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }
  try {
    const updates = {};
    if (email) updates.email = email;
    if (displayName) updates.displayName = displayName;
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (password) updates.hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email or displayName already exists' });
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
