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
  (response) => response.data,

  // Error (status >= 400): Format the error into a standardized JSON object
  (error) => {
    const formattedError = handleAxiosError(error);
    return Promise.reject(formattedError);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // Ex. modify or add headers, tokens, or other configurations to requests before they are sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
