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
    console.error("Error fetching comments:", err); // Log the error
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

// Endpoint to find the post ID for a given comment or reply
router.get('/:id/find-post', async (req, res) => {
  const { id } = req.params;

  // Validate the comment ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Comment ID' });
  }

  try {
    // Recursive function to find the root post for a comment
    const findPostForComment = async (commentId) => {
      // Check if the comment exists directly in a post
      const post = await Post.findOne({ commentIDs: commentId });
      if (post) {
        return post; // Return the post ID if found
      }

      // Find the parent comment for the current comment
      const parentComment = await Comment.findOne({ commentIDs: commentId });
      if (parentComment) {
        return findPostForComment(parentComment._id); // Recursively check the parent comment
      }

      // If no post or parent comment is found
      return null;
    };

    // Start the search with the given comment ID
    const postId = await findPostForComment(id);

    if (!postId) {
      return res.status(404).json({ message: 'Post not found for this comment.' });
    }

    res.json({ postId });
  } catch (err) {
    res.status(500).json({ message: `Error finding post: ${err.message}` });
  }
});



// GET all comments for a specific post in a hierarchical structure
router.get('/post/:postId', async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid Post ID.' });
  }

  try {
    const postComments = await Comment.find({ postId, parentCommentId: null })
      .populate('commentedBy', 'displayName email') // Populate commenter info
      .populate({
        path: 'childCommentIDs',
        populate: {
          path: 'commentedBy',
          select: 'displayName email', // Populate nested commenters
        },
      });

    res.json(postComments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments: ' + err.message });
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

  // Validate Object IDs
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
      commentIDs: [],
      commentedDate: new Date(),
    });

    const savedComment = await newComment.save();

    // Update parent comment or post
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { commentIDs: savedComment._id },
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { commentIDs: savedComment._id },
      });
    }

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// PUT - Update a comment by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Comment ID' });
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    )
      .populate('commentedBy', 'displayName email')
      .populate('content commentedBy');

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

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


// Helper function to recursively delete child comments
const deleteNestedComments = async (commentIds) => {
  for (const commentId of commentIds) {
    const comment = await Comment.findById(commentId);
    if (comment) {
      // Recursively delete child comments first
      if (comment.childCommentIDs && comment.childCommentIDs.length > 0) {
        await deleteNestedComments(comment.childCommentIDs);
      }
      // Delete the comment itself
      await Comment.findByIdAndDelete(commentId);
    }
  }
};

// DELETE a comment by ID (and all its replies)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Comment ID' });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Recursively delete child comments
    if (comment.childCommentIDs && comment.childCommentIDs.length > 0) {
      await deleteNestedComments(comment.childCommentIDs);
    }

    // Delete the comment itself
    await Comment.findByIdAndDelete(id);

    res.json({ message: 'Comment and its replies deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;