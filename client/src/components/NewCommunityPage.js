import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/NewCommunityPage.css";

function NewCommunityPage({ userId, userDisplayName, isLoggedIn }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            setError("Community name is required and cannot be empty.");
            return;
        }
        if (name.length > 100) {
            setError("Community name cannot exceed 100 characters.");
            return;
        }
        if (!description.trim()) {
            setError("Community description is required and cannot be empty.");
            return;
        }
        if (description.length > 500) {
            setError("Community description cannot exceed 500 characters.");
            return;
        }

        // Prepare the community object
        const community = {
            name,
            description,
            createdBy: userId,
            members: [userId],
        };

        // Submit the community
        fetch("/api/communities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(community),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 409) {
                    throw new Error("Community name already exists.");
                } else {
                    throw new Error("Failed to create the community.");
                }
            })
            .then((data) => {
                alert("Community created successfully!");
                navigate(`/community/${data._id}`); // Redirect to the new community's view page
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className="new-community-page">
            <h1>Create a New Community</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Community Name (required, max 100 characters):
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label>
                    Description (required, max 500 characters):
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </label>
                <button type="submit">Engender Community</button>
            </form>
        </div>
    );
}

export default NewCommunityPage;
