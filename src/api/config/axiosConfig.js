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

// Get the auth token from AppContext. We need to implement proper local storage coockies with react useMemo()
const getAuthToken = axiosInstance.interceptors.request.use(
  (config) => {
    // Always include the token in requests
    const token =
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMSIsImp0aSI6IjcyMzU2ZmM4LWYwYzEtNDY0Mi04NzA3LWRmNTY2NjRmYThjNiIsIm5iZiI6MTc0NTQzMDIzMiwiZXhwIjoxNzQ1NzY3NzMyLCJpYXQiOjE3NDU0MzAyMzIsImlzcyI6IkVxdWlsb2dBUEkiLCJhdWQiOiJFcXVpbG9nQ2xpZW50In0.IOQNQu1ZzEkgUNAVru3nnsM6zMHm6qTM72Q6eaw2hS08wb-0DOqcvL12uGoyBDIOvzcVQ9r8iNbQcVrQOHbSYQ";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Adding authorization token to request");
    } else {
      console.warn("No authorization token available");
    }

    return config;

    // Do something before request is sent

    // Authentication logic will go here when implemented
    // JWT with HmacSha512 encryption for request authentication
  },
  (error) => {
    console.error("Request configuration error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
