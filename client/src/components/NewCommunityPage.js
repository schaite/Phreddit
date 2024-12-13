import React, { useEffect,useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../stylesheets/NewCommunityPage.css";

function NewCommunityPage({refreshCommunities}) {
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [communityId, setCommunityId] = useState(null); // For edit mode

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we are in edit mode
    const community = location.state?.community;
    if (community) {
      setCommunityName(community.name);
      setDescription(community.description);
      setCommunityId(community._id);
      setIsEditMode(true);
    }
  }, [location.state]);

  const validateInputs = async () => {
    const newErrors = {};

    if (!communityName || communityName.length > 100) {
      newErrors.communityName = "Community name must not be empty or exceed 100 characters.";
    } else if (!isEditMode) {
      // For create mode, check if the community name is unique
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
  
      if (isEditMode) {
        // Update existing community
        const updatedCommunity = {
          name: communityName,
          description,
        };
        await axios.put(`/api/communities/${communityId}`, updatedCommunity);
        refreshCommunities();
        navigate(`/communities/${communityId}`); // Navigate using existing communityId
      } else {
        // Create new community
        const newCommunity = {
          name: communityName,
          description,
          members: [loggedInUser.id],
          createdBy: loggedInUser.id,
        };
        const response = await axios.post("/api/communities", newCommunity);
        const createdCommunity = response.data;
        refreshCommunities();
        navigate(`/communities/${createdCommunity._id}`); // Navigate using the newly created community ID
      }
    } catch (error) {
      console.error("Error creating/updating community:", error);
      setErrors({
        global: error.response?.data?.message || "An error occurred while creating/updating the community.",
      });
    }
  };  

  return (
    <div className="new-community-view">
      <h1>{isEditMode ? "Edit Community" : "Create a New Community"}</h1>

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
        {isEditMode ? "Update Community" : "Create Community"}
      </button>
    </div>
  );
}

export default NewCommunityPage;

