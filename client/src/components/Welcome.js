import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/Welcome.css';

const Welcome = () => {
    return (
        <div className="welcome-container">
            <h1>Welcome to Phreddit!</h1>
            <p>Your gateway to an amazing community experience.</p>
            <div className="welcome-buttons">
                <Link to="/register" className="button">Register as a New User</Link>
                <Link to="/login" className="button">Login as an Existing User</Link>
                <Link to="/home" className="button">Continue as a Guest User</Link>
            </div>
        </div>
    );
};

export default Welcome;
