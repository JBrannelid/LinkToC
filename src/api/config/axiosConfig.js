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

axiosInstance.interceptors.response.use(
  // Sucess (status 2xx): Return response data
  (response) => {
    console.log(response.data);
    return response.data;
  },

  // Error (status >= 400): Format the error into a standardized JSON object
  (error) => {
    const formattedError = handleAxiosError(error);
    console.error(
      `[API Error] ${formattedError.type}: ${formattedError.message}`
    );
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
