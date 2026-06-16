// frontend/src/api/axiosInstance.js
import axios from 'axios';

// Instantiate Axios with core environment baseline limits
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // Timeout requests after 10 seconds to fail-fast under high network latency
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor: Automatically injects JWT Bearer tokens prior to socket transmission
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('poly_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catches global network errors (e.g., unauthorized drops or server crashes)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear security tokens and force-evict session back to login view if token is malformed or expired
      localStorage.removeItem('poly_auth_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;