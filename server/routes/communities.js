const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Community = require('../models/Communities');
const User = require('../models/Users'); 
const Post = require('../models/Posts'); 

// GET all communities, filter by name or userId (optional)
router.get('/', async (req, res) => {
    const { name, userId } = req.query;

    try {
        // If `name` is provided, search for a community by name
        if (name) {
            const community = await Community.findOne({ name });
            return res.json({ exists: !!community });
        }

        // If `userId` is provided, filter communities by membership
        let query = {};
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid User ID" });
            }
            query.members = userId;
        }

        // Fetch all communities or filtered communities
        const communities = await Community.find(query)
            .populate('members', 'displayName email') // Populate members
            .populate('postIDs', 'title content'); // Populate posts
        return res.json(communities);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


//GET a community by ID
router.get('/:id', async (req,res)=>{
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Community ID' });
    }
    try{
        const community = await Community.findById(req.params.id)
            .populate('members','displayName email')
            .populate('postIDs');
        if(!community) return res.status(404).json({message: 'Community not found'});
        res.json(community);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET - Communities a user has joined
router.get('/user-communities/:userId', async (req, res) => {
    const { userId } = req.params;
  
    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }
  
    try {
      // Find all communities where the user is a member
      const joinedCommunities = await Community.find({ members: userId })
        .populate('members', 'displayName email') // Populate member details
        .populate('postIDs', 'title content'); // Optionally populate posts
  
      res.json(joinedCommunities); // Return the joined communities
    } catch (err) {
      console.error('Error fetching user communities:', err);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  

//POST - Create a new community
// POST /communities - Create a new community
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const update = req.body; // The update payload

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Community ID' });
    }

    // Check if `$push` is present in the request body
    if (update.$push && update.$push.postIDs) {
        if (!mongoose.Types.ObjectId.isValid(update.$push.postIDs)) {
            return res.status(400).json({ message: 'Invalid Post ID in $push.postIDs' });
        }
        try {
            // Perform a `$push` operation
            const updatedCommunity = await Community.findByIdAndUpdate(
                id,
                { $push: { postIDs: update.$push.postIDs } },
                { new: true, runValidators: true }
            )
                .populate('members', 'displayName email') // Populate updated member details
                .populate('postIDs', 'title content'); // Populate updated post details

            if (!updatedCommunity) {
                return res.status(404).json({ message: 'Community not found' });
            }
            return res.json(updatedCommunity);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        // Handle full updates
        const { name, description, members, postIDs } = update;

        // Validate members and postIDs as ObjectIds
        if (members && !Array.isArray(members)) {
            return res.status(400).json({ message: 'Members must be an array of User IDs' });
        }
        if (members && !members.every((id) => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: 'Invalid User ID in members' });
        }
        if (postIDs && !postIDs.every((id) => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: 'Invalid Post ID in postIDs' });
        }
        try {
            const updatedCommunity = await Community.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                    members,
                    postIDs,
                    memberCount: members ? members.length : undefined, // Update memberCount if members are updated
                },
                { new: true, runValidators: true }
            )
                .populate('members', 'displayName email') // Populate updated member details
                .populate('postIDs', 'title content'); // Populate updated post details

            if (!updatedCommunity) {
                return res.status(404).json({ message: 'Community not found' });
            }
            res.json(updatedCommunity);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
});


//DELETE a community ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Community ID' });
    }

    try {
        // Find the community to delete
        const community = await Community.findById(id);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Delete associated posts
        await Post.deleteMany({ _id: { $in: community.postIDs } });

        // Delete the community
        await community.deleteOne();
        res.json({ message: 'Community and associated posts deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;