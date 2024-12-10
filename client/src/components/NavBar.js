import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../stylesheets/NavBar.css";

function NavBar({ isLoggedIn, userId }) {
    const [communities, setCommunities] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const isCreateCommunityActive = location.pathname === "/new-community";

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                if (isLoggedIn && userId) {
                    // Use the `/user-communities/:userId` endpoint to fetch joined communities
                    const joinedResponse = await axios.get(
                        `/api/communities/user-communities/${userId}`
                    );
                    const joinedCommunities = joinedResponse.data;

                    // Fetch all communities
                    const allResponse = await axios.get("/api/communities");
                    const allCommunities = allResponse.data;

                    // Sort communities: joined at the top
                    const sortedCommunities = allCommunities.sort((a, b) => {
                        const isAJoined = joinedCommunities.some((community) => community._id === a._id);
                        const isBJoined = joinedCommunities.some((community) => community._id === b._id);

                        // Bring joined communities to the top
                        if (isAJoined && !isBJoined) return -1;
                        if (!isAJoined && isBJoined) return 1;

                        // Alphabetical sort
                        return a.name.localeCompare(b.name);
                    });

                    setCommunities(sortedCommunities);
                } else {
                    // If not logged in, fetch all communities and sort alphabetically
                    const response = await axios.get("/api/communities");
                    const sortedCommunities = response.data.sort((a, b) => a.name.localeCompare(b.name));
                    setCommunities(sortedCommunities);
                }
            } catch (error) {
                console.error("Error fetching communities:", error);
            }
        };

        fetchCommunities();
    }, [isLoggedIn, userId]); // Update when login status or user ID changes

    const handleCreateCommunityClick = () => {
        if (isLoggedIn) {
            navigate("/new-community"); // Navigate to the new community page
        } else {
            alert("You must be logged in to create a community."); // Notify the user
        }
    };

    return (
        <nav id="nav-bar" className="nav-bar">
            <Link
                to="/home"
                className={`nav-link ${location.pathname === "/home" ? "active-link" : ""}`}
            >
                Home
            </Link>
            <div className="delimiter"></div>
            <h3 className="communities-header">Communities</h3>
            <button
                onClick={handleCreateCommunityClick}
                className={`create-community-button ${isCreateCommunityActive ? "active-button" : ""}`}
                id="create-community-button"
                disabled={!isLoggedIn} // Disable the button if the user is not logged in
                title={!isLoggedIn ? "Login required to create a community" : ""}
            >
                Create Community
            </button>
            <ul className="community-list">
                {communities.map((community) => (
                    <li key={community._id}>
                        <Link
                            to={`/communities/${community._id}`}
                            className={`nav-link ${
                                location.pathname === `/communities/${community._id}` ? "active-link" : ""
                            }`}
                        >
                            {community.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBar;


