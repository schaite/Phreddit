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
import PostPage from "./PostPage";
import NewCommentPage from "./NewCommentPage";
import UserProfile from "./UserProfile";

export default function Phreddit() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    displayName: "",
    role: "guest",
    id: null,
  });   
  const [refreshCount, setRefreshCount] = useState(0);
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

  const refreshCommunities = () => {
    setRefreshCount((prevCount) => prevCount + 1);
  }
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
                refreshCommunities={refreshCommunities}
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
                  path="/post/:postID"
                  element={
                    <PostPage
                    isLoggedIn={isLoggedIn}
                    />
                  }
                />
                <Route 
                  path="/new-post" 
                  element={<NewPostPage 
                    isLoggedIn={isLoggedIn} 
                    userId={user.id}
                    />
                  }
                />
                <Route 
                  path="/new-community" 
                  element={
                    <NewCommunityPage 
                      userId={user.id} 
                      isLoggedIn={isLoggedIn} 
                      refreshCommunities={refreshCommunities}
                    />
                  } 
                />
                <Route
                  path="/post/:postID/new-comment"
                  element={
                    <NewCommentPage
                      isLoggedIn={isLoggedIn}
                      userId={isLoggedIn ? user.id : null}
                    />
                  }
                />
                <Route 
                  path="/profile" 
                  element={
                      <UserProfile 
                           userId={isLoggedIn ? user.id : null} 
                          isLoggedIn={isLoggedIn}
                          refreshCommunities={refreshCommunities}
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
