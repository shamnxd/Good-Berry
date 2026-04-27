import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
