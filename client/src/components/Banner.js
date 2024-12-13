import React, { useEffect, useState } from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import '../stylesheets/Banner.css';

function Banner({ isLoggedIn,userDisplayName, onLogout }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isNewPostPage, setIsNewPostPage] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsNewPostPage(location.pathname === "/new-post");

        // Detect if user is offline
        if (!navigator.onLine) {
            setError("You are offline. Please check your internet connection.");
        }
    }, [location.pathname]);

    const handleSearchSubmit = () => {
        try {
            if (!navigator.onLine) {
                throw new Error("You are offline. Cannot perform a search.");
            }
            if (searchQuery.trim()) {
                window.location.href = `/search?query=${encodeURIComponent(searchQuery.trim())}`;
            }
        } catch (error) {
            setError(error.message);
        }
        setSearchQuery(""); // Clear search input
    };

    const handleLogout = () => {
        onLogout();
        navigate("/");
    }

    const handleProfileClick = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?.id;
    
        if (userId) {
            navigate(`/profile/${userId}`);
        } else {
            navigate("/profile");
        }
    };
    
    return (
        <div>
            <header id="banner" className="banner">
                {/* "phreddit" Button */}
                <Link 
                    to="/" 
                    className="app-name" 
                    id="phreddit-title"
                >
                    phreddit
                </Link>
                {/* Search Box */}
                <input 
                    type="text" 
                    className="search-box" 
                    id="search-box" 
                    placeholder="Search Phreddit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(event) => event.key === 'Enter' && handleSearchSubmit()}
                />
                <div className="button-container">
                    {/* Profile Button */}
                    <button 
                        className="profile-button"
                        disabled={!isLoggedIn} // Disabled for guests
                        onClick={isLoggedIn ? handleProfileClick : null}
                    >
                        {isLoggedIn ? userDisplayName : "Guest"}
                    </button>
                    {/* Logout Button */}
                    {isLoggedIn && (
                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )}
                    {/* Create Post Button */}
                    <button
                        className={`create-post-button ${isNewPostPage ? "active" : ""}`}
                        disabled={!isLoggedIn} // Disabled for guests
                        title={!isLoggedIn ? "Login required to create a post" : ""}
                        onClick={() => navigate("/new-post")} // Navigate to new post page
                    >
                        Create Post
                    </button>
                </div>
                
            </header>
            <hr />
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button
                        className="error-restart-button"
                        onClick={() => navigate("/")}
                    >
                        Go to Welcome Page
                    </button>
                </div>
            )}
        </div>
    );
}

export default Banner;
