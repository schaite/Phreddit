const express = require ('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Posts');
const LinkFlair = require('../models/LinkFlairs'); // Adjust the path as per your project structure


//GET all posts
router.get('/', async (req, res)=>{
    try{
        const posts = await Post.find()
            .populate('postedBy', 'displayName email')
            .populate('linkFlairID', 'content')
            .populate('commentIDs');
        res.json(posts);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

// GET post by ID
router.get('/:id', async(req, res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'Invalid Post ID'});
    }
    try{
        const post = await Post.findById(req.params.id)
            .populate('postedBy','displayName email')
            .populate('linkFlairID','content')
            .populate('commentIDs');
        if(!post) return res.status(404).json({message: 'Post not found'});
        res.json(post);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

// POST - Create a new post 
router.post('/', async (req, res) => {
    const { title, content, postedBy, linkFlairID } = req.body;

    // Validate required fields
    if (!title || !content || !postedBy) {
        return res.status(400).json({ message: 'Title, content, and postedBy are required' });
    }

    // Validate ObjectId fields
    if (!mongoose.Types.ObjectId.isValid(postedBy)) {
        return res.status(400).json({ message: 'Invalid User ID in postedBy' });
    }
    if (linkFlairID && !mongoose.Types.ObjectId.isValid(linkFlairID)) {
        return res.status(400).json({ message: 'Invalid Link Flair ID' });
    }

    // Create the post
    const post = new Post({
        title,
        content,
        postedBy,
        linkFlairID: linkFlairID || null,
        commentIDs: [],
        views: 0,
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// PUT - Update a post by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }

    const { title, content, linkFlairID } = req.body;

    // Validate ObjectId for linkFlairID if provided
    if (linkFlairID && !mongoose.Types.ObjectId.isValid(linkFlairID)) {
        return res.status(400).json({ message: 'Invalid Link Flair ID' });
    }

    try {
        const post = await Post.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        )
            .populate('postedBy', 'displayName email') // Populate user details
            .populate('linkFlairID', 'content')       // Populate link flair content
            .populate('commentIDs');                 // Populate associated comments
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a post by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }

    try {
        const post = await Post.findByIdAndDelete(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 