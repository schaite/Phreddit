import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import "../stylesheets/NewCommentPage.css";

function NewCommentPage({ userId, isLoggedIn }) {
  const [content, setContent] = useState(""); // State for comment content
  const [errors, setErrors] = useState({}); // State for form validation errors
  const [isEditMode, setIsEditMode] = useState(false); // State to track if it's edit mode
  const [commentId, setCommentId] = useState(null); // State to store the comment ID being edited
  const navigate = useNavigate(); // React Router navigation hook
  const { postID } = useParams(); // Fetch postID from the URL
  const [searchParams] = useSearchParams();
  const parentCommentID = searchParams.get("parent"); // Fetch parent comment ID if available
  const location = useLocation(); // Access the location state

  useEffect(() => {
    const comment = location.state?.comment;
    if (comment) {
      setContent(comment.content);
      setCommentId(comment._id);
      setIsEditMode(true);
    }
  }, [location.state]);

  // Validate the form inputs
  const validateForm = () => {
    const formErrors = {};
    if (!content.trim()) {
      formErrors.content = "Comment content is required.";
    } else if (content.length > 500) {
      formErrors.content = "Comment cannot exceed 500 characters.";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      setErrors({ global: "You need to be logged in to add or edit a comment." });
      return;
    }

    const isValid = validateForm();
    if (!isValid) return;

    try {
      if (isEditMode) {
        // Update existing comment
        await axios.put(`/api/comments/${commentId}`, { content });
      } else {
        // Create a new comment or reply
        const commentData = {
          content,
          commentedBy: userId, // Use the logged-in user's ID
          postId: postID, // Include postId explicitly
          parentCommentId: parentCommentID || null, // Parent comment ID if it's a reply
        };
        await axios.post("/api/comments/add-comment", commentData);
      }

      // Redirect back to the post page with a flag to refresh comments
      navigate(`/post/${postID}`, { state: { refreshComments: true } });
    } catch (error) {
      console.error("Error submitting comment:", error.response || error.message);
      setErrors({ global: "Failed to submit the comment. Please try again later." });
    }
  };

  return (
    <div className="new-comment-page">
      {/* Adjusting the header based on mode */}
      <h1>{isEditMode ? "Edit Comment" : parentCommentID ? "Reply to Comment" : "Add a Comment"}</h1>

      {/* Global Error */}
      {errors.global && <p className="error">{errors.global}</p>}

      {/* Comment Content Field */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="comment-content">Comment (Required; max 500 characters):</label>
          <textarea
            id="comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength="500"
            placeholder="Write your comment here..."
          />
          {errors.content && <div className="error">{errors.content}</div>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-comment">
          {isEditMode ? "Update Comment" : parentCommentID ? "Submit Reply" : "Submit Comment"}
        </button>
      </form>
    </div>
  );
}

export default NewCommentPage;