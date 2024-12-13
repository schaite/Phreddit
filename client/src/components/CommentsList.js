import React from "react";
import '../stylesheets/Comment.css';
import Comment from './Comment.js';
import PropTypes from 'prop-types';


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

CommentsList.propTypes = {
    commentIDs: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired, // Each commentID object should have a string _id
        })
    ).isRequired,
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired, // Each comment object should have a string _id
            commentedDate: PropTypes.string.isRequired, // Comment date as a string
        })
    ).isRequired,
    postID: PropTypes.string.isRequired, // postID should be a string
    isLoggedIn: PropTypes.bool.isRequired, // isLoggedIn should be a boolean
};


export default CommentsList;