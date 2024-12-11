import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../stylesheets/NewCommunityPage.css";

function NewCommunityPage({refreshCommunities}) {
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateInputs = async () => {
    const newErrors = {};

    if (!communityName || communityName.length > 100) {
      newErrors.communityName = "Community name must not be empty or exceed 100 characters.";
    } else {
      // Check if the community name is unique
      try {
        const response = await axios.get(`/api/communities?name=${encodeURIComponent(communityName)}`);
        if (response.data.exists) {
          newErrors.communityName = "Community name already exists.";
        }
      } catch (error) {
        console.error("Error checking community name uniqueness:", error);
        newErrors.communityName = "Unable to verify community name.";
      }
    }

    if (!description || description.length > 500) {
      newErrors.description = "Description must not be empty or exceed 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCommunity = async () => {
    const isValid = await validateInputs();
    if (!isValid) return;

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      if (!loggedInUser) {
        setErrors({ global: "User must be logged in to create a community." });
        navigate("/welcome"); // Redirect to welcome page
        return;
      }

      const newCommunity = {
        name: communityName,
        description,
        members: [loggedInUser.id],
      };

      const response = await axios.post("/api/communities", newCommunity);
      const createdCommunity = response.data;

      refreshCommunities();
      navigate(`/communities/${createdCommunity._id}`);
    } catch (error) {
      console.error("Error creating community:", error);
      setErrors({
        global: error.response?.data?.message || "An error occurred while creating the community.",
      });
    }
  };

  return (
    <div className="new-community-view">
      <h1>Create a New Community</h1>

      {/* Global Error */}
      {errors.global && <p className="error">{errors.global}</p>}

      {/* Community Name Input */}
      <div>
        <label>
          Community Name<span className="required">(Required)</span>
        </label>
        <input
          type="text"
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
          maxLength="100"
          placeholder="Enter community name"
        />
        {errors.communityName && <p className="error">{errors.communityName}</p>}
      </div>

      {/* Description Input */}
      <div>
        <label>
          Description<span className="required">(Required)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength="500"
          placeholder="Enter community description"
        />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      {/* Submit Button */}
      <button id="engender-community" onClick={handleCreateCommunity}>
        Create Community
      </button>
    </div>
  );
}

export default NewCommunityPage;

