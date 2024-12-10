import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./Register";
import Welcome from "./Welcome";
import Login from "./Login";
import Banner from "./Banner";
import NavBar from "./NavBar";
import Home from "./Home";
import NewPostPage from "./NewPostPage";
import ErrorBoundary from "./ErrorBoundary";
import "../stylesheets/phreddit.css";
import NewCommunityPage from "./NewCommunityPage";

export default function Phreddit() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    displayName: "",
    role: "guest",
    id: null,
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
    setUser({ displayName: "", role: "guest", id: null});

    // Clear login state and user details from localStorage
    localStorage.removeItem("user");
  }; 

  return (
    <ErrorBoundary>
      <Router>
        <div>
            <Banner 
              isLoggedIn={isLoggedIn} 
              userDisplayName={isLoggedIn? user.displayName: "Guest"}
              onLogout={isLoggedIn? handleLogout : null} 
            />
          <div className="container">
            <NavBar
                isLoggedIn={isLoggedIn}
                userId = {isLoggedIn? user.id: null}
            />
              <Routes>
                <Route path="/" element={<Welcome/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login onLogin={handleLogin}/>} />
                <Route 
                  path="/home" 
                  element={
                    <Home
                      isLoggedIn={isLoggedIn}
                      userId={isLoggedIn?user.id : null}
                    />
                  }
                />
                <Route 
                  path="/new-post" 
                  element={<NewPostPage 
                  isLoggedIn={isLoggedIn} 
                  userId={isLoggedIn ? user.id : null}
                    />
                  }
                />
                <Route 
                  path="/new-community" 
                  element={
                    <NewCommunityPage 
                    userId={isLoggedIn? user.id: null} 
                    isLoggedIn={isLoggedIn} 
                    />
                  } 
                />
              </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}
