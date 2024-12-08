import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import "../stylesheets/Login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        const validationErrors = {};
        if (!formData.email) validationErrors.email = 'Email is required.';
        if (!formData.password) validationErrors.password = 'Password is required.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Display validation errors
            return;
        }

        try {
            await loginUser(formData);
            setMessage(''); // Clear any previous error messages
            navigate('/'); // Redirect to the homepage after successful login
        } catch (error) {
            // Handle server-side errors
            setMessage(error.response?.data?.message || 'Invalid email or password.');
        }
    };
    

    return (
        <div className="login-container">
            <h2>Login</h2>
            {message && <p className="error-message">{message}</p>}
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
