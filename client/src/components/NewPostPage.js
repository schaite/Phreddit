import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/NewPostPage.css";

function NewPostPage({ userId, userDisplayName, isLoggedIn }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [community, setCommunity] = useState("");
    const [linkFlair, setLinkFlair] = useState("");
    const [newLinkFlair, setNewLinkFlair] = useState("");
    const [communities, setCommunities] = useState([]);
    const [linkFlairs, setLinkFlairs] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }

        // Fetch communities and link flairs
        fetch("/api/communities")
            .then((response) => response.json())
            .then((data) => setCommunities(data))
            .catch(() => setError("Failed to load communities."));

        fetch("/api/linkflairs")
            .then((response) => response.json())
            .then((data) => setLinkFlairs(data))
            .catch(() => setError("Failed to load link flairs."));
    }, [isLoggedIn, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!title.trim()) {
            setError("Title is required and cannot be empty.");
            return;
        }
        if (title.length > 100) {
            setError("Title cannot exceed 100 characters.");
            return;
        }
        if (!content.trim()) {
            setError("Content cannot be empty.");
            return;
        }
        if (!community) {
            setError("You must select a community.");
            return;
        }

        // Prepare the post object
        const post = {
            title,
            content,
            community,
            postedBy: userId,
            linkFlair: newLinkFlair.trim() || linkFlair,
        };

        // Submit the post
        fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Post created successfully!");
                    navigate("/");
                } else {
                    setError("Failed to create the post.");
                }
            })
            .catch(() => setError("Failed to create the post."));
    };

    return (
        <div className="new-post-page">
            <h1>Create a New Post</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Community (required):
                    <select
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                    >
                        <option value="">Select a community</option>
                        {communities.map((comm) => (
                            <option key={comm._id} value={comm._id}>
                                {comm.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Title (required, max 100 characters):
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label>
                    Content (required):
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </label>
                <label>
                    Link Flair (optional):
                    <select
                        value={linkFlair}
                        onChange={(e) => setLinkFlair(e.target.value)}
                        disabled={newLinkFlair.trim() !== ""}
                    >
                        <option value="">Select a link flair</option>
                        {linkFlairs.map((flair) => (
                            <option key={flair._id} value={flair.content}>
                                {flair.content}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Or Create a New Link Flair (max 30 characters):
                    <input
                        type="text"
                        value={newLinkFlair}
                        onChange={(e) => setNewLinkFlair(e.target.value)}
                        maxLength="30"
                        disabled={linkFlair !== ""}
                    />
                </label>
                <button type="submit">Submit Post</button>
            </form>
        </div>
    );
}

export default NewPostPage;
