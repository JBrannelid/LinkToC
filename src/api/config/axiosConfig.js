import axios from "axios";
import { handleAxiosError } from "../utils/errors";

// Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry logic
    if (error.message === "Network Error" && !originalRequest._retry) {
      originalRequest._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return axiosInstance(originalRequest);
    }

    // Rate limiting
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  // Success (status 2xx): Return response data
  (response) => {
    return response.data;
  },

  // Error (status >= 400): Format the error into a standardized JSON object
  (error) => {
    if (error.response?.status === 404) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.details?.message ||
        "";

      if (
        errorMessage.includes("No horses found") ||
        errorMessage.includes("No horses")
      ) {
        return {
          isSuccess: true,
          statusCode: 200,
          value: [],
          message: null,
        };
      }

      if (errorMessage.includes("This post has no comments")) {
        return {
          isSuccess: true,
          statusCode: 200,
          value: [],
          message: null,
        };
      }
    }
    const formattedError = handleAxiosError(error);

    // Don't log 404 errors
    const isExpected404 =
      formattedError.statusCode === 404 &&
      (error.config?.url?.includes("/api/user-stables/user/") ||
        (error.config?.url?.includes("/horses/with-owners") &&
          formattedError.details?.message?.includes("No horses")));

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
    const noAuthRequired = ["/api/auth/login", "/api/auth/register"];

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
