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

// Get the auth token - Hardcoded. We need to implement proper local storage coockies with react useMemo()
const getAuthToken = () => {
  return (
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwianRpIjoiMjZkNDJlYTItNWFkMi00NjYzLTlhMDQtZWVjMTYyMTc2Njg1IiwibmJmIjoxNzQ0NzIzMTExLCJleHAiOjE3NDUwNjA2MTEsImlhdCI6MTc0NDcyMzExMSwiaXNzIjoiRXF1aWxvZ0FQSSIsImF1ZCI6IkVxdWlsb2dDbGllbnQifQ.Qbggs1FHzC-OmNi9IlwdKavKd5_Dy-qF9NLVrnR1p0Zhc-pYttt5sDjDsHjK-hmKRBf4Rcqx0cL9nbBdgmAvWQ" ||
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwianRpIjoiMzM1NTRjNjEtMDMyMS00NTA1LTkzZTMtZDA0MWJjZGVjN2FhIiwibmJmIjoxNzQ1Mzk3NjczLCJleHAiOjE3NDU3MzUxNzMsImlhdCI6MTc0NTM5NzY3MywiaXNzIjoiRXF1aWxvZ0FQSSIsImF1ZCI6IkVxdWlsb2dDbGllbnQifQ.zFq2pZWGDOBwjCPQsr7pfQZVFl0xKicFLxtMDOzRjC7-TBJ9u-gb2jOFTXHkaUpd8I_Vv1eQHifhDg77t2oTng"
  );
};

axiosInstance.interceptors.request.use(
  (config) => {
    // Always include the token in requests
    const token = getAuthToken();
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
