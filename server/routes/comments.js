const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Comment = require('../models/Comments');
const User = require('../models/Users');
const Post = require('../models/Posts');

// GET all comments or comments by a specific user
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    let query = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
      query.commentedBy = userId; // Filter by userId if provided
    }

    const comments = await Comment.find(query)
      .populate('commentedBy', 'displayName email')
      .populate('commentIDs', 'content commentedBy');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments." });
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
// POST - Add a new comment or reply
router.post('/add-comment', async (req, res) => {
  const { postId, parentCommentId, content, commentedBy } = req.body;

  // Validate required fields
  if (!content || !commentedBy || !postId) {
    return res.status(400).json({ message: 'Content, commentedBy, and postId are required.' });
  }

  // Validate ObjectId fields
  if (!mongoose.Types.ObjectId.isValid(commentedBy)) {
    return res.status(400).json({ message: 'Invalid User ID in commentedBy.' });
  }
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid Post ID.' });
  }
  if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
    return res.status(400).json({ message: 'Invalid Parent Comment ID.' });
  }

  try {
    const newComment = new Comment({
      content,
      commentedBy,
      postId,
      parentCommentId: parentCommentId || null,
      childCommentIDs: [],
      postedDate: Date.now(),
    });

    const savedComment = await newComment.save();

    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { childCommentIDs: savedComment._id },
      });
    } else {
      const Post = require('../models/Posts');
      await Post.findByIdAndUpdate(postId, {
        $push: { commentIDs: savedComment._id },
      });
    }

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// PUT - Vote on a comment
router.put('/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { type, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Comment ID' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
  }

  try {
      const comment = await Comment.findById(id).populate('commentedBy');
      if (!comment) return res.status(404).json({ message: 'Comment not found' });

      const voter = await User.findById(userId);
      if (!voter) return res.status(404).json({ message: 'User not found' });

      // Check voter's reputation
      if (voter.reputation < 50) {
          return res.status(403).json({ message: 'User does not have enough reputation to vote' });
      }

      // Update vote count and user's reputation
      const increment = type === 'upvote' ? 1 : -1;
      const reputationChange = type === 'upvote' ? 5 : -10;

      comment.vote += increment;
      comment.commentedBy.reputation += reputationChange;

      await comment.save();
      await comment.commentedBy.save();

      res.json({ vote: comment.vote });
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