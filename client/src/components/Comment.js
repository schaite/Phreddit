import React from "react";
import { useNavigate } from "react-router-dom";
import { formatTimestamp } from "./Timestamp";
import '../stylesheets/Comment.css';

const Comment = ({ comment, comments, postID, indentLevel = 0, isLoggedIn}) => {
    const navigate = useNavigate(); 

    const handleReplyClick = () => {
        navigate(`/post/${postID}/new-comment?parent=${comment._id}`);
    };

    const renderReplies = (commentIDs, level) => {
        return commentIDs
            .map(commentID => comments.find(c => c._id === commentID._id)) // Find comment by ID in the comments array
            .filter(comment => comment) // Filter out undefined comments
            .sort((a, b) => new Date(b.commentedDate) - new Date(a.commentedDate)) // Sort by newest first
            .map(reply => (
                <Comment 
                    key={reply._id} 
                    comment={reply} 
                    comments={comments} 
                    postID={postID} 
                    indentLevel={level + 1} 
                    isLoggedIn={isLoggedIn}
                />
            ));
    };

    return (
        <div className="comment" style={{ marginLeft: `${indentLevel * 20}px` }}>
            <p className="comment-header">
                <strong>{comment.commentedBy.displayName} | {formatTimestamp(comment.commentedDate)}</strong>
            </p>
            <p className="comment-content">{comment.content}</p>
            <p className="comment-upvotes">
                <span className="upvotes">{comment.vote} Upvotes</span>
            </p>

            {isLoggedIn ? (
                <button className="reply-button" onClick={handleReplyClick}>
                    Reply
                </button>
            ) : (
                ''
            )}
            {comment.commentIDs?.length > 0 && (
                <div className="comment-replies">
                    {renderReplies(comment.commentIDs, indentLevel)}
                </div>
            )}
        </div>
    );
};

export default Comment;


