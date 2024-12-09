import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./Register";
import Welcome from "./Welcome";
import Login from "./Login";
import Banner from "./Banner";
import NavBar from "./NavBar";
import ErrorBoundary from "./ErrorBoundary";

export default function Phreddit() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    displayName: "",
    role: "guest",
    joinedCommunities: [],
  });   

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (userDetails) => {
    setIsLoggedIn(true);
    setUser(userDetails);

    // Save login state and user details to localStorage
    localStorage.setItem("user", JSON.stringify(userDetails));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ displayName: "", role: "guest", joinedCommunities: []});

    // Clear login state and user details from localStorage
    localStorage.removeItem("user");
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="wrapper">
            <Banner 
              isLoggedIn={isLoggedIn} 
              userDisplayName={user.displayName}
              onLogout={handleLogout} 
            />
          <div className="nav-container">
            <NavBar
                isLoggedIn={isLoggedIn}
                joinedCommunityIds={user.joinedCommunities}
            />
            <div className="main-container">
              <Routes>
                <Route path="/" element={<Welcome/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login onLogin={handleLogin}/>} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}
