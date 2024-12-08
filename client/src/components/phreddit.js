import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./Register";
import Welcome from "./Welcome";
import Login from "./Login";
import Banner from "./Banner";
import ErrorBoundary from "./ErrorBoundary";

export default function Phreddit() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    displayName: "",
    role: "guest",
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
    setUser({ displayName: "", role: "guest" });

    // Clear login state and user details from localStorage
    localStorage.removeItem("user");
  };

  return (
    <ErrorBoundary>
      <Router>
        <Banner 
          isLoggedIn={isLoggedIn} 
          userDisplayName={user.displayName}
          onLogout={handleLogout} 
        />
        <Routes>
          <Route path="/" element={<Welcome/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login onLogin={handleLogin}/>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
