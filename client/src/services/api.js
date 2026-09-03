import axios from 'axios';
import { storage } from '../utils/storage';
import { API_BASE_URL, ENDPOINTS } from '../constants/apiRoutes';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor: attach bearer token
api.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop if refresh endpoint itself failed
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(ENDPOINTS.AUTH.LOGIN) &&
      !originalRequest.url.includes(ENDPOINTS.AUTH.REFRESH_TOKEN)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = storage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const res = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        storage.setAccessToken(accessToken);
        if (newRefreshToken) {
          storage.setRefreshToken(newRefreshToken);
        }

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        storage.clearAuth();
        window.dispatchEvent(new CustomEvent('auth:expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const customError = new Error(
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'Request failed'
    );
    customError.code = error.response?.data?.error?.code;
    customError.details = error.response?.data?.error?.details;
    customError.status = error.response?.status;

    return Promise.reject(customError);
  }
);

export default api;
