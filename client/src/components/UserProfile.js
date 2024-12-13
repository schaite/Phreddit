import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import "../stylesheets/UserProfile.css";
import { formatTimestamp } from "./Timestamp";

  const UserProfile = ({ userId, isLoggedIn, refreshCommunities, isAdmin }) => {
    const { userId: routeUserId } = useParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [activeTab, setActiveTab] = useState(isAdmin ? "users" : "posts"); // Set default tab based on admin status
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    
    const fetchData = useCallback(async (type, targetUserId) => {
      if (!targetUserId && type !== "users") {
        setError("User ID is missing. Please log in again.");
        return;
      }
    
      try {
        let endpoint = "";
        if (type === "users") {
          endpoint = `/api/users`;
        } else if (type === "posts") {
          endpoint = `/api/posts?userId=${targetUserId}`;
        } else if (type === "communities") {
          endpoint = `/api/communities/created-communities/${targetUserId}`;
        } else if (type === "comments") {
          const comments = await axios.get(`/api/comments?userId=${targetUserId}`);
          const combinedData = await mapCommentsToPosts(comments.data);
          setData(combinedData);
          return;
        }
    
        const response = await axios.get(endpoint);
        setData(response.data || []);
      } catch (err) {
        console.error(`Failed to load ${type}:`, err.message);
        setError(`Failed to load ${type}`);
        setData([]);
      }
    }, []); // Empty dependency array ensures memoization
  
    useEffect(() => {
      const targetUserId = routeUserId || userId || JSON.parse(localStorage.getItem("user"))?.id;
    
      if (!targetUserId) {
        setError("User ID is missing. Please log in again.");
        return;
      }
    
      fetchUserInfo(targetUserId);
      fetchData(activeTab, targetUserId);
    }, [routeUserId, userId, isLoggedIn, activeTab, fetchData]);    

  const fetchUserInfo = async (targetUserId) => {
    try {
      const response = await axios.get(`/api/users/${targetUserId}`);
      setUserInfo(response.data);
    } catch (err) {
      console.error("Error fetching user info:", err.message);
      setError("Failed to load user information.");
    }
  };
  

  const mapCommentsToPosts = async (comments) => {
    const mappedComments = await Promise.all(
      comments.map(async (comment) => {
        try {
          const postResponse = await axios.get(`/api/comments/${comment._id}/find-post`);
          return {
            ...comment,
            content: comment.content || "No content available", // Default for missing content
            postTitle: postResponse.data.postId?.title || "Unknown Post",
            postId: postResponse.data.postId || "Unknown Post",
          };
        } catch (err) {
          console.error(`Failed to fetch post for comment ${comment._id}:`, err.message);
          return {
            ...comment,
            content: comment.content || "No content available", // Default for missing content
            postTitle: "Unknown Post",
            postId: null,
          };
        }
      })
    );
    return mappedComments;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab); // Save selected tab to localStorage
    fetchData(tab, routeUserId || userId || JSON.parse(localStorage.getItem("user"))?.id);
  };

  const handleNavigateToUser = (targetUserId) => {
    navigate(`/profile/${targetUserId}`);
  };

  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone and will delete all their data."
    );
    if (confirm) {
      try {
        await axios.delete(`/api/users/${userId}`);
        fetchData("users"); // Refresh user list
      } catch (err) {
        console.error("Error deleting user:", err.message);
        alert("Failed to delete the user.");
      }
    }
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
            {routeUserId && isAdmin && (
              <button onClick={() => handleNavigateToUser(userId)} className="admin-button">Back to Admin Profile</button>
            )}
          </div>
          <div className="tabs">
            {isAdmin && (
              <button
                className={activeTab === "users" ? "active" : ""}
                onClick={() => handleTabChange("users")}
              >
                Users
              </button>
            )}
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
            {activeTab === "users" && data.length > 0 ? (
              data.map((user) => (
                <div key={user._id} className="list-item">
                  {isAdmin && (
                    <>
                      <p>
                        <Link
                          to={`/profile/${user._id}`}
                          state={{ user }}
                          className="edit-link"
                        >
                          <strong>{user.displayName}</strong> | {user.email} | Reputation: {user.reputation}
                        </Link>
                      </p>
                      <button onClick={() => handleDeleteUser(user._id)}>Delete User</button>
                    </>
                  )}
                </div>
              ))
            ) : activeTab === "users" ? (
              <p>No users to display.</p>
            ) : activeTab === "posts" && data.length > 0 ? (
              data.map((post) => (
                <div key={post._id} className="list-item">
                  <p>
                  <Link to="/new-post" state={{ post }} className="edit-link">
                    <strong>{post.title}</strong>
                  </Link>
                  </p>
                  <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                </div>
              ))
            ) : activeTab === "posts" ? (
              <p>No posts to display.</p>
            ) : activeTab === "communities" && data.length > 0 ? (
              data.map((community) => (
                <div key={community._id} className="list-item">
                  <p>
                    <Link to="/new-community" state={{ community }} className="edit-link">
                      <strong>{community.name}</strong>
                    </Link>
                  </p>
                  <button onClick={() => handleDeleteCommunity(community._id)}>
                    Delete
                  </button>
                </div>
              ))
            ) : activeTab === "comments" && data.length > 0 ? (
              data.map((comment) => (
                <div key={comment._id} className="list-item">
                  <p>
                  <Link
                    to={`/post/${comment.postId}/new-comment?parent=${comment._id}`}
                    state={{ comment }}
                    className="edit-link"
                  >
                      <strong>{comment.postTitle}</strong>: {comment.content
                        ? `${comment.content.substring(0, 20)}${comment.content.length > 20 ? "..." : ""}`
                        : "No content available"}
                    </Link> 
                  </p>
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

UserProfile.propTypes = {
  userId: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  refreshCommunities: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default UserProfile;
