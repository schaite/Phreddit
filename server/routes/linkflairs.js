const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const LinkFlair = require('../models/LinkFlairs');

// GET all link flairs
router.get('/', async (req, res) => {
  try {
    const linkFlairs = await LinkFlair.find();
    res.json(linkFlairs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific link flair by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Link Flair ID' });
  }

  try {
    const linkFlair = await LinkFlair.findById(id);
    if (!linkFlair) return res.status(404).json({ message: 'Link flair not found' });
    res.json(linkFlair);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { content } = req.body;

  if (!content || content.length > 30) {
      return res.status(400).json({ message: 'Content is required and must not exceed 30 characters.' });
  }

  try {
      const linkFlair = new LinkFlair({ content });
      const savedFlair = await linkFlair.save();
      res.status(201).json(savedFlair);
  } catch (err) {
      res.status(500).json({ message: 'Error creating link flair: ' + err.message });
  }
});


// PUT (update) an existing link flair by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Link Flair ID' });
  }
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }
  try {
    const linkFlair = await LinkFlair.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );

    if (!linkFlair) return res.status(404).json({ message: 'Link flair not found' });
    res.json(linkFlair);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a link flair by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Link Flair ID' });
  }
  try {
    const linkFlair = await LinkFlair.findByIdAndDelete(id);
    if (!linkFlair) return res.status(404).json({ message: 'Link flair not found' });
    res.json({ message: 'Link flair deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;