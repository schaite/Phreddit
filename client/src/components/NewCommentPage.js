import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const NewCommentPage = ({ isLoggedIn, userId }) => {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { postID } = useParams();
  const [searchParams] = useSearchParams();
  const parentCommentId = searchParams.get("parent");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setErrorMessage("You need to be logged in to comment.");
      return;
    }

    try {
      const response = await axios.post("/api/comments", {
        content,
        commentedBy: userId,
        commentIDs: parentCommentId ? [parentCommentId] : [],
      });

      navigate(`/post/${postID}`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to submit comment.");
    }
  };

  return (
    <div>
      <h2>New Comment</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          style={{ width: "100%", minHeight: "100px", marginBottom: "10px" }}
        ></textarea>
        <button type="submit" style={{ alignSelf: "flex-start" }}>Submit</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
  
};

export default NewCommentPage;
