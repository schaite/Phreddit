import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import "../stylesheets/Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        displayName: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // Clear specific field error
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        const validationErrors = {};
        if (!formData.email) validationErrors.email = 'Email is required.';
        if (!formData.displayName) validationErrors.displayName = 'Display Name is required.';
        if (!formData.firstName) validationErrors.firstName = 'First Name is required.';
        if (!formData.lastName) validationErrors.lastName = 'Last Name is required.';
        if (!formData.password) validationErrors.password = 'Password is required.';
        if (!formData.confirmPassword) validationErrors.confirmPassword = 'Confirm Password is required.';
        if (formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Display validation errors
            return;
        }

        try {
            const response = await registerUser(formData);
            setMessage(response.message);
            navigate('/'); // Redirect to the welcome page after successful registration
        } catch (error) {
            // Handle server-side errors
            setMessage(error.response?.data?.message || 'Error registering account.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
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
                        type="text"
                        name="displayName"
                        placeholder="Display Name"
                        value={formData.displayName}
                        onChange={handleChange}
                    />
                    {errors.displayName && <span className="error">{errors.displayName}</span>}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <span className="error">{errors.lastName}</span>}
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
                <div className="form-group">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Register;
