import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatTimestamp } from "./Timestamp";
import '../stylesheets/Comment.css';

const Comment = ({ comment, comments, postID, indentLevel = 0, isLoggedIn}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 

    const handleReplyClick = () => {
        navigate(`/post/${postID}/new-comment?parent=${comment._id}`);
    };

    const handleVote = async (type) => {
        if (!isLoggedIn) {
            setErrorMessage('You need to be logged in to vote.');
            return;
        }

        try {
            const response = await axios.put(`/api/comments/${comment._id}/vote`, {
                type,
                userId: JSON.parse(localStorage.getItem("user")).id,
            });

            // Update comment vote count locally
            comment.vote = response.data.vote;
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "An error occurred while voting.");
            alert(error.response?.data?.message || "An error occurred while voting.");
        }
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
                <>
                    <div className="comment-buttons">
                        <button className="comment-upvote-button" onClick={() => handleVote("upvote")}>
                            Upvote
                        </button>
                        <button className="comment-downvote-button" onClick={() => handleVote("downvote")}>
                            Downvote
                        </button>
                        <button className="reply-button" onClick={handleReplyClick}>
                            Reply
                        </button>
                    </div>
                </>
                
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


