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

axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent

    // Authentication logic will go here when implemented
    // JWT with HmacSha512 encryption for request authentication

    return config;
  },
  (error) => {
    // Handle request configuration errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
