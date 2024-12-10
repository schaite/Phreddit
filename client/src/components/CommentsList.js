import React from "react";
import '../stylesheets/Comment.css';
import Comment from './Comment.js';

const CommentsList = ({ commentIDs, comments, postID, isLoggedIn }) => {
    // Render the top-level comments and their replies
    return (
        <div className="comments-list">
            {commentIDs
                .map(commentObj => comments.find(c => c._id === commentObj._id))  // Get the top-level comments
                .filter(comment => comment)  // Filter out undefined comments
                .sort((a, b) => new Date(b.commentedDate) - new Date(a.commentedDate))  // Sort by newest first
                .map(comment => (
                    <Comment 
                        key={comment._id} 
                        comment={comment} 
                        comments={comments} 
                        postID={postID}
                        isLoggedIn={isLoggedIn}
                    />
                ))}
        </div>
    );
};

export default CommentsList;