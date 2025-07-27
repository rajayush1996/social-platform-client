import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { useNavigate } from 'react-router-dom';

// Optionally, get token from localStorage or cookies
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If token expired (401 Unauthorized error)
    if (error.response && error.response.status === 401) {
      // Optionally, clear the token from localStorage or cookies
      localStorage.removeItem('accessToken');

      // Redirect to login page
      const navigate = useNavigate(); // Use useNavigate hook to navigate
      navigate('/login'); // Or replace with your actual login path

      // Optionally show a toast or alert to inform the user
      // toast.error("Session expired. Please log in again.");

      // Reject the error to propagate it
      return Promise.reject(error);
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
