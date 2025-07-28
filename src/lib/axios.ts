import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { useNavigate } from 'react-router-dom';
import { getCookie, setCookie } from './utils';
import Cookies from 'js-cookie'


// Optionally, get token from localStorage or cookies
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function getRefreshToken() {
  const refresh = Cookies.get('refreshToken');
  return Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
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

// Response interceptor for handling errors and refreshing token if expired
axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data
    if (
      data &&
      typeof data === 'object' &&
      ((Object.prototype.hasOwnProperty.call(data, 'success') && data.success === false) ||
        (Object.prototype.hasOwnProperty.call(data, 'status') && data.status !== 'success'))
    ) {
      return Promise.reject({
        message: data.message || 'Request failed',
        response,
      })
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is a 401 (Unauthorized) and the request hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // const refreshToken = getRefreshToken();
        // console.log("🚀 ~ :45 ~ refreshToken:", refreshToken);

        // if (!refreshToken) {
        //   localStorage.removeItem('accessToken');
        //   window.location.href = '/login'; // Redirect if no refresh token is found
        //   return Promise.reject(error); // Exit the interceptor early if refreshToken is missing
        // }

        const rawAxios = axios.create({ 
          baseURL: API_CONFIG.BASE_URL,
          withCredentials: true 
        });
        // Attempt to refresh the access token using the refresh token from cookies
        const { data } = await rawAxios.post(`${API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN}`);

        // Store the new access token and refresh token in localStorage
        localStorage.setItem('accessToken', data.data.accessToken);
        // setCookie('refreshToken', data.refreshToken); // Update refresh token in cookies

        // Update the Authorization header with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

        // Retry the original request with the new token
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle error during refresh token request
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Clear cookie

        // Redirect to login page if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);



export default axiosInstance;
