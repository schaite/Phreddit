import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../stylesheets/NavBar.css";

function NavBar({ isLoggedIn, joinedCommunityIds = [] }) {
    const [communities, setCommunities] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const isCreateCommunityActive = location.pathname === "/new-community";

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/communities");
                // Sort communities: joined ones at the top
                const sortedCommunities = response.data.sort((a, b) => {
                    const isAJoined = joinedCommunityIds.includes(a._id);
                    const isBJoined = joinedCommunityIds.includes(b._id);
                    if (isAJoined && !isBJoined) return -1;
                    if (!isAJoined && isBJoined) return 1;
                    return a.name.localeCompare(b.name); // Sort alphabetically
                });
                setCommunities(sortedCommunities);
            } catch (error) {
                console.error("Error fetching communities:", error);
            }
        };

        fetchCommunities();
    }, [joinedCommunityIds]);

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
                to="/"
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

