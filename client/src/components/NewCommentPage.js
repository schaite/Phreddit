import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../stylesheets/NewCommentPage.css";

function NewCommentPage({ isLoggedIn, userId }) {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { postID } = useParams();
  const [searchParams] = useSearchParams();
  const parentCommentId = searchParams.get("parent");

  const validateInput = () => {
    const newErrors = {};
    if (!content.trim()) {
      newErrors.content = "Comment cannot be empty.";
    } else if (content.length > 500) {
      newErrors.content = "Comment must not exceed 500 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      setErrors({ global: "You need to be logged in to comment." });
      return;
    }

    const isValid = validateInput();
    if (!isValid) return;

    try {
      const commentData = {
        content,
        commentedBy: userId,
        postId: postID,
        parentCommentId,
      };

      await axios.post("/api/comments/add-comment", commentData);

      // Redirect back to post page with updated comments
      navigate(`/post/${postID}`, { state: { refreshComments: true } });
    } catch (error) {
      console.error("Error adding comment:", error);
      setErrors({ global: error.response?.data?.message || "Failed to add comment." });
    }
  };

  return (
    <div className="new-comment-page">
      <h1>New Comment</h1>

      {/* Global Error */}
      {errors.global && <p className="error">{errors.global}</p>}

      {/* Comment Input */}
      <div>
        <label>
          Comment<span className="required">(Required)</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength="500"
          placeholder="Write your comment here..."
        />
        {errors.content && <p className="error">{errors.content}</p>}
      </div>

      {/* Submit Button */}
      <button id="submit-comment" onClick={handleSubmit}>
        Submit Comment
      </button>
    </div>
  );
}

export default NewCommentPage;