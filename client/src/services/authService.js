import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
    return response.data;
};

export const logoutUser = async () => {
    // No API for logout, just return success
    return { message: 'Logged out successfully' };
};
