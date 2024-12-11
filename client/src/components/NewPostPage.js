import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../stylesheets/NewPostPage.css";

function NewPostPage({ userId }) {
  const [communities, setCommunities] = useState([]);
  const [linkFlairs, setLinkFlairs] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedFlair, setSelectedFlair] = useState("");
  const [newFlair, setNewFlair] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const [joinedCommunitiesRes, allCommunitiesRes, linkFlairsRes] = await Promise.all([
          axios.get(`/api/communities/user-communities/${userId}`),
          axios.get("/api/communities"),
          axios.get("/api/linkflairs"),
        ]);

        const joinedCommunities = joinedCommunitiesRes.data;
        const allCommunities = allCommunitiesRes.data;

        // Sort communities: joined ones first, followed by the rest alphabetically
        const sortedCommunities = allCommunities.sort((a, b) => {
          const isJoinedA = joinedCommunities.some((community) => community._id === a._id);
          const isJoinedB = joinedCommunities.some((community) => community._id === b._id);

          if (isJoinedA && !isJoinedB) return -1;
          if (!isJoinedA && isJoinedB) return 1;
          return a.name.localeCompare(b.name);
        });

        setCommunities(sortedCommunities);
        setLinkFlairs(linkFlairsRes.data);
      } catch (error) {
        console.error("Error fetching communities or flairs:", error);
      }
    };

    fetchCommunities();
  }, [userId]);

  const validateInputs = () => {
    const newErrors = {};
    if (!selectedCommunity) newErrors.community = "Please select a community.";
    if (!title || title.length > 100)
      newErrors.title = "Title must not be empty or exceed 100 characters.";
    if (newFlair && newFlair.length > 30)
      newErrors.flair = "New flair must not exceed 30 characters.";
    if (!content) newErrors.content = "Post content cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    // const communityName = communities.find(
    //   (c) => c._id === selectedCommunity
    // )?.name;

    const newPost = {
      title,
      content,
      postedBy: userId, // Automatically assign logged-in user's ID
      linkFlairID: newFlair ? await createNewFlair(newFlair) : selectedFlair, // Adjusted flair logic
      postedDate: new Date().toISOString(),
      views: 0,
      commentIDs: [],
      vote:0,
    };

    try {
      // Step 1: Create a new post
      const postResponse = await axios.post("/api/posts", newPost);
      const createdPost = postResponse.data;
    

      // Step 2: Update the selected community to add the new post ID
      await axios.put(`/api/communities/${selectedCommunity}`, {
        $push: { postIDs: createdPost._id },
      });

      // Redirect to the Home Page using useNavigate
      navigate("/home");
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  // Helper function to create a new flair if needed
  const createNewFlair = async (content) => {
    try {
      const response = await axios.post("/api/linkflairs", { content });
      return response.data._id; // Return the new flair ID
    } catch (error) {
      console.error("Error creating new flair:", error);
      return null;
    }
  };

  return (
    <div className="new-post-page-view">
      <h2>Create a New Post</h2>

      {/* Community Selection */}
      <label>
        Community<span className="required">(Required)</span>
      </label>
      <select
        value={selectedCommunity}
        onChange={(e) => setSelectedCommunity(e.target.value)}
      >
        <option value="">Select a community</option>
        {communities.map((community) => (
          <option key={community._id} value={community._id}>
            {community.name}
          </option>
        ))}
      </select>
      {errors.community && <p className="error">{errors.community}</p>}

      {/* Title */}
      <label>
        Title<span className="required">(Required)</span>
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength="100"
        placeholder="Enter a title (max 100 characters)"
      />
      {errors.title && <p className="error">{errors.title}</p>}

      {/* Link Flair */}
      <label>Link Flair (Optional)</label>
      <select
        value={selectedFlair}
        onChange={(e) => setSelectedFlair(e.target.value)}
        disabled={!!newFlair}
      >
        <option value="">Select a link flair</option>
        {linkFlairs.map((flair) => (
          <option key={flair._id} value={flair._id}>
            {flair.content}
          </option>
        ))}
      </select>
      <p>OR</p>
      <input
        type="text"
        value={newFlair}
        onChange={(e) => setNewFlair(e.target.value)}
        maxLength="30"
        placeholder="Enter a new link flair (max 30 characters)"
        disabled={!!selectedFlair}
      />
      {errors.flair && <p className="error">{errors.flair}</p>}

      {/* Content */}
      <label>
        Content<span className="required">(Required)</span>
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter the post content"
      />
      {errors.content && <p className="error">{errors.content}</p>}

      {/* Submit Button */}
      <button onClick={handleSubmit}>Submit Post</button>
    </div>
  );
}

export default NewPostPage;
