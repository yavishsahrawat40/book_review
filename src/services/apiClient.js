// frontend/src/services/apiClient.js
import axios from 'axios';

// Get the backend API URL from environment variables, or use a default
const API_BASE_URL = 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or however you store your token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle responses, e.g., for global error handling like 401
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Example: Handle unauthorized access - perhaps redirect to login or clear token
      console.error('API Client: Unauthorized access (401). Token might be invalid or expired.');
      // localStorage.removeItem('authToken');
      // You might dispatch a logout action here or redirect
      // window.location.href = '/login'; // Force redirect
    }
    // You can also handle other common errors globally here
    return Promise.reject(error);
  }
);


export default apiClient;
