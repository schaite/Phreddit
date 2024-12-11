const mongoose = require('mongoose');
const Post = require('./models/Posts'); // Adjust the path to your Post model
const Comment = require('./models/Comments'); // Adjust the path to your Comment model
const User = require('./models/Users'); // Adjust the path to your User model

describe('MongoDB Post and Comments Deletion Test', () => {
    let user, post, comment;

    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect('mongodb://127.0.0.1:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create a dummy user with all required fields
        user = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            hashedPassword: 'hashedpassword123',
            firstName: 'Test',
            lastName: 'User',
            displayName: 'Test User',
        });

        // Create a dummy post
        post = await Post.create({
            title: 'Test Post',
            content: 'This is a test post.',
            postedBy: user._id, // Use the dummy user's ID
        });

        // Create a dummy comment
        comment = await Comment.create({
            content: 'This is a test comment.',
            postId: post._id,
            commentedBy: user._id, // Add the required commentedBy field
        });

        // Link the comment to the post
        post.commentIDs.push(comment._id);
        await post.save();
    });

    afterAll(async () => {
        // Clean up the database and close the connection
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    test('Should delete a post and all associated comments', async () => {
        // Collect IDs of the post and associated comments
        const postId = post._id;
        const commentIds = post.commentIDs;

        // Delete the post
        await Post.findByIdAndDelete(postId);

        // Delete associated comments
        await Comment.deleteMany({ _id: { $in: commentIds } });

        // Assert that the post is deleted
        const deletedPost = await Post.findById(postId);
        expect(deletedPost).toBeNull();

        // Assert that all associated comments are deleted
        const remainingComments = await Comment.find({ _id: { $in: commentIds } });
        expect(remainingComments.length).toBe(0);
    });
});
