import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

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
    // Handle error without automatic redirect
    return Promise.reject(error);
  }
);

export default axiosInstance; 