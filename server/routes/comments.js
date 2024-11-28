const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Comment = require('../models/Comments');

// GET all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('commentedBy', 'displayName email')
      .populate('commentIDs', 'content commentedBy');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific comment by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Comment ID' });
  }
  try {
    const comment = await Comment.findById(id)
      .populate('commentedBy', 'displayName email') // Populate commenter details
      .populate('commentIDs', 'content commentedBy'); // Populate nested comments
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new comment
router.post('/', async (req, res) => {
  const { content, commentedBy, commentIDs } = req.body;

  // Validate required fields
  if (!content || !commentedBy) {
    return res.status(400).json({ message: 'Content and commentedBy are required' });
  }

  // Validate ObjectId for commentedBy
  if (!mongoose.Types.ObjectId.isValid(commentedBy)) {
    return res.status(400).json({ message: 'Invalid User ID in commentedBy' });
  }

  // Validate ObjectId for commentIDs (if provided)
  if (commentIDs && !Array.isArray(commentIDs)) {
    return res.status(400).json({ message: 'commentIDs must be an array of valid Comment IDs' });
  }

  const comment = new Comment({
    content,
    commentedBy,
    commentIDs: commentIDs || [],
  });

  try {
    const newComment = await comment.save();
    // Populate the response with related data
    const populatedComment = await Comment.findById(newComment._id)
      .populate('commentedBy', 'displayName email')
      .populate('commentIDs', 'content commentedBy');
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) an existing comment by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, commentIDs } = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Comment ID' });
  }

  // Validate ObjectId for commentIDs (if provided)
  if (commentIDs && !Array.isArray(commentIDs)) {
    return res.status(400).json({ message: 'commentIDs must be an array of valid Comment IDs' });
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content, commentIDs },
      { new: true, runValidators: true }
    )
      .populate('commentedBy', 'displayName email') // Populate commenter details
      .populate('commentIDs', 'content commentedBy'); // Populate nested comments

    if (!updatedComment) return res.status(404).json({ message: 'Comment not found' });
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a comment by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Comment ID' });
  }

  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;