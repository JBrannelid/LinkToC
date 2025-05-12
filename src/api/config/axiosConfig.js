import axios from "axios";
import { handleAxiosError } from "../utils/errors";

// Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Only retry for network errors, not auth or validation
        if (error.message === 'Network Error' &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/login')) { // Don't retry auth requests

            originalRequest._retry = true;

            console.log('Retrying failed request due to network error...');

            try {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await axiosInstance(originalRequest);
            } catch (retryError) {
                // If retry fails, continue to regular error handling
                return Promise.reject(retryError);
            }
        }

        // If not retrying, pass to regular error handling
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
  // Sucess (status 2xx): Return response data
  (response) => {
    console.log(response.data);
    return response.data;
  },

  // Error (status >= 400): Format the error into a standardized JSON object
  (error) => {
    const formattedError = handleAxiosError(error);

    // Don't log 404 errors for user-stables endpoint (expected for new users)
    const isExpected404 =
      formattedError.statusCode === 404 &&
      error.config?.url?.includes("/api/user-stables/user/");

    if (!isExpected404) {
      console.error(
        `[API Error] ${formattedError.type}: ${formattedError.message}`
      );
      if (formattedError.details) {
        console.error("Error details:", formattedError.details);
      }
    }

    return Promise.reject(formattedError);
  }
);

// Request interceptor to add auth token from sessionStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip adding token for endpoints that don't require authentication
    const noAuthRequired = [
      "/api/auth/login",
      "/api/auth/register",
      // More page that dont need a authentication,
    ];

    if (noAuthRequired.some((endpoint) => config.url.includes(endpoint))) {
      return config;
    }

    // Get token from sessionStorage (managed by AuthContext)
    const token = sessionStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request configuration error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
