import React, {useEffect, useState} from "react";
import axios from "axios";
import "../stylesheets/UserProfile.css";

function UserProfile({userId, isLoggedIn}){
    const [userInfo, setUserInfo] = useState({});
    const [activeTab, setActiveTab] = useState("posts");
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) {
            setError("User ID is missing. Please log in again.");
            return;
        }

        console.log("Fetching user info for ID:", userId); // Debugging log

        axios
            .get(`/api/users/${userId}`)
            .then((response) => setUserInfo(response.data))
            .catch((err) => {
                console.error("Error fetching user info:", err.message);
                setError("Failed to load user information.");
            });

        fetchData("posts");
    }, [userId, isLoggedIn]);

    const fetchData = (type) =>{
        if (!userId) {
            setError("User ID is missing. Please log in again.");
            return;
        }
        let endpoint = "";
        switch (type) {
            case "posts":
                endpoint = `/api/posts?userId=${userId}`;
                break;
            case "comments":
                endpoint = `/api/comments?userId=${userId}`;
                break;
            case "communities":
                endpoint = `/api/communities/user-communities/${userId}`;
                break;
            default:
                return;
        }
        console.log(`Fetching data for ${type} from:`, endpoint); // Debugging log

        axios.get(endpoint)
            .then((response)=> setData(response.data))
            .catch(()=> setError(`Failed to load ${type}`));
    };
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        fetchData(tab);
    };

    return (
        <div className="user-profile">
            <h1>User Profile</h1>
            {error ? (
                <div className="error-message">{error}</div>
            ):(
                <>
                    <div className="profile-info">
                        <p><strong>DisplayName:</strong> {userInfo.displayName}</p>
                        <p><strong>Email:</strong> {userInfo.email}</p>
                        <p><strong>Member Since:</strong> {userInfo.memberSince}</p>
                        <p><strong>Reputation:</strong> {userInfo.reputation}</p>
                    </div>
                    <div className = "tabs">
                        <button
                            className={activeTab === "posts" ? "active" : ""}
                            onClick={() => handleTabChange("posts")}
                        >
                            Posts
                        </button>
                        <button
                            className={activeTab === "comments" ? "active" : ""}
                            onClick={() => handleTabChange("comments")}
                        >
                            Comments
                        </button>
                        <button
                            className={activeTab === "communities" ? "active" : ""}
                            onClick={() => handleTabChange("communities")}
                        >
                            Communities
                        </button>
                    </div>
                    <div className="list">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <div key={item._id} className="list-item">
                                    <p>{item.content || item.title || item.name}</p>
                                </div>
                            ))
                        ) : (
                            <p>No {activeTab} to display.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default UserProfile;