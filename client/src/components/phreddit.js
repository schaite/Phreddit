import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./Register";
import Welcome from "./Welcome";
import Login from "./Login";
import Banner from "./Banner";
import NavBar from "./NavBar";
import NewPostPage from "./NewPostPage";
import ErrorBoundary from "./ErrorBoundary";
import axios from "axios";
import "../stylesheets/phreddit.css";
import NewCommunityPage from "./NewCommunityPage";

export default function Phreddit() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    displayName: "",
    role: "guest",
  });   
  const [joinedCommunityIds, setJoinedCommunityIds] = useState([]);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
      fetchJoinedCommunities(storedUser._id);
    }
  }, []);

  const handleLogin = (userDetails) => {
    setIsLoggedIn(true);
    setUser(userDetails);

    // Save login state and user details to localStorage
    localStorage.setItem("user", JSON.stringify(userDetails));
    fetchJoinedCommunities(userDetails._id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ displayName: "", role: "guest"});
    setJoinedCommunityIds([]); 

    // Clear login state and user details from localStorage
    localStorage.removeItem("user");
  };

  const fetchJoinedCommunities = async (userId) => {
    try {
      // Fetch all communities
      const response = await axios.get("http://localhost:8000/api/communities");
      const joinedCommunities = response.data.filter((community) =>
        community.members.some((member) => member._id === userId)
      ); // Filter communities where the user is a member
  
      const communityIds = joinedCommunities.map((community) => community._id); // Extract community IDs
      setJoinedCommunityIds(communityIds); // Store in state
    } catch (error) {
      console.error("Error fetching user's joined communities:", error);
    }
  };  

  return (
    <ErrorBoundary>
      <Router>
        <div>
            <Banner 
              isLoggedIn={isLoggedIn} 
              userDisplayName={user.displayName}
              onLogout={handleLogout} 
            />
          <div className="container">
            <NavBar
                isLoggedIn={isLoggedIn}
                joinedCommunityIds={joinedCommunityIds}
            />
            <div className="main-container">
              <Routes>
                <Route path="/" element={<Welcome/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login onLogin={handleLogin}/>} />
                <Route path="/new-post" element={<NewPostPage isLoggedIn={isLoggedIn} userId={isLoggedIn ? user._id : null}/>}/>
                <Route path="/new-community" element={<NewCommunityPage userId={user._id} isLoggedIn={isLoggedIn} />} />
              <Routes>
            </div>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}
