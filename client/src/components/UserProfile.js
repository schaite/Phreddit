import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../stylesheets/UserProfile.css";
import { formatTimestamp } from "./Timestamp";

function UserProfile({ userId, isLoggedIn, refreshCommunities }) {
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState("posts");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = userId || JSON.parse(localStorage.getItem("user"))?.id;

    if (!storedUserId) {
      setError("User ID is missing. Please log in again.");
      return;
    }

    axios
      .get(`/api/users/${storedUserId}`)
      .then((response) => setUserInfo(response.data))
      .catch((err) => {
        console.error("Error fetching user info:", err.message);
        setError("Failed to load user information.");
      });

    fetchData("posts", storedUserId);
  }, [userId, isLoggedIn]);

  const fetchData = async (type, storedUserId) => {
    if (!storedUserId) {
      setError("User ID is missing. Please log in again.");
      return;
    }

    try {
      let endpoint = "";
      if (type === "posts") {
        endpoint = `/api/posts?userId=${storedUserId}`;
      } else if (type === "comments") {
        const comments = await axios.get(`/api/comments?userId=${storedUserId}`);
        const combinedData = await mapCommentsToPosts(comments.data);
        setData(combinedData);
        return;
      } else if (type === "communities") {
        endpoint = `/api/communities/user-communities/${storedUserId}`;
      }

      const response = await axios.get(endpoint);
      setData(response.data);
    } catch (err) {
      console.error(`Failed to load ${type}:`, err.message);
      setError(`Failed to load ${type}`);
    }
  };

  const mapCommentsToPosts = async (comments) => {
    const mappedComments = await Promise.all(
      comments.map(async (comment) => {
        try {
          const postResponse = await axios.get(`/api/comments/${comment._id}/find-post`);
          return { ...comment, postTitle:postResponse.data.postId.title, postId: postResponse.data.postId || "Unknown Post" };
        } catch (err) {
          console.error(`Failed to fetch post for comment ${comment._id}:`, err.message);
          return { ...comment, postId: null };
        }
      })
    );

    return mappedComments;
  };

  const handleTabChange = (tab) => {
    const storedUserId = userId || JSON.parse(localStorage.getItem("user"))?.id;
    setActiveTab(tab);
    fetchData(tab, storedUserId);
  };

  const handleEditCommunity = (community) => {
    navigate("/new-community", { state: { community } });
  };

  const handleDeleteCommunity = async (communityId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this community? This action cannot be undone."
    );
    if (confirm) {
      try {
        await axios.delete(`/api/communities/${communityId}`);
        refreshCommunities();
        handleTabChange("communities");
      } catch (err) {
        console.error("Error deleting community:", err.message);
        alert("Failed to delete the community.");
      }
    }
  };

  const handleEditPost = (post) => {
    navigate("/new-post", { state: { post } });
  };

  const handleDeletePost = async (postId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post? This action will delete all associated comments and cannot be undone."
    );
    if (confirm) {
      try {
        await axios.delete(`/api/posts/${postId}`);
        handleTabChange("posts");
      } catch (err) {
        console.error("Error deleting post:", err.message);
        alert("Failed to delete the post.");
      }
    }
  };

  const handleEditComment = (comment) => {
    if (!comment.postId || !comment.postId._id) {
      console.error("Invalid comment or postId is missing:", comment);
      alert("Cannot edit this comment. Post ID is missing.");
      return;
    }
  
    navigate(`/post/${comment.postId._id}/new-comment?parent=${comment._id}`, {
      state: {
        comment,
      },
    });
  };
  

  const handleDeleteComment = async (commentId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this comment? All replies will also be deleted."
    );
    if (confirm) {
      try {
        await axios.delete(`/api/comments/${commentId}`);
        handleTabChange("comments");
      } catch (err) {
        console.error("Error deleting comment:", err.message);
        alert("Failed to delete the comment.");
      }
    }
  };

  //console.log(data);

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="profile-info">
            <p>
              <strong>DisplayName:</strong> {userInfo.displayName}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Member Since:</strong> {formatTimestamp(userInfo.memberSince)}
            </p>
            <p>
              <strong>Reputation:</strong> {userInfo.reputation}
            </p>
          </div>
          <div className="tabs">
            <button
              className={activeTab === "posts" ? "active" : ""}
              onClick={() => handleTabChange("posts")}
            >
              Posts
            </button>
            <button
              className={activeTab === "communities" ? "active" : ""}
              onClick={() => handleTabChange("communities")}
            >
              Communities
            </button>
            <button
              className={activeTab === "comments" ? "active" : ""}
              onClick={() => handleTabChange("comments")}
            >
              Comments
            </button>
          </div>
          <div className="list">
            {activeTab === "posts" && data.length > 0 ? (
              data.map((post) => (
                <div key={post._id} className="list-item">
                  <p>{post.title}</p>
                  <button onClick={() => handleEditPost(post)}>Edit</button>
                  <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                </div>
              ))
            ) : activeTab === "posts" ? (
              <p>No posts to display.</p>
            ) : activeTab === "communities" && data.length > 0 ? (
              data.map((community) => (
                <div key={community._id} className="list-item">
                  <p>{community.name}</p>
                  <button onClick={() => handleEditCommunity(community)}>Edit</button>
                  <button onClick={() => handleDeleteCommunity(community._id)}>
                    Delete
                  </button>
                </div>
              ))
            ) : activeTab === "comments" && data.length > 0 ? (
              data.map((comment) => (
                <div key={comment._id} className="list-item">
                  <p>
                    {comment.postTitle}: {comment.content}...
                  </p>
                  <button onClick={() => handleEditComment(comment)}>Edit</button>
                  <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                </div>
              ))
            ) : (
              <p>No {activeTab} to display.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;
