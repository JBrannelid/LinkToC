import createBaseService from "./baseService.js";
import { ENDPOINTS } from "./endpoints.js";
import axiosInstance from "../config/axiosConfig";
import tokenStorage from "../../utils/tokenStorage.js";

const baseService = createBaseService(ENDPOINTS.AUTH);

const authService = {
  ...baseService,
  // Login: POST /api/auth/login
  login: async (loginData) => {
    if (!loginData || !loginData.email || !loginData.password) {
      throw new Error("Email and password are required");
    }
    try {
      return await axiosInstance.post(`${ENDPOINTS.AUTH}/login`, loginData);
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          "Authentication failed. Please check your credentials.";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "No response from authentication server. Please try again later."
        );
      } else {
        throw new Error(
          `Error setting up authentication request: ${error.message}`
        );
      }
    }
  },

  // Register: POST /api/auth/register
  register: async (registerData) => {
    if (!registerData) {
      throw new Error("Registration data is required");
    }
    return await axiosInstance.post(`${ENDPOINTS.AUTH}/register`, registerData);
  },

  // RefreshToken: POST /api/auth/refreshToken
  refreshToken: async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No token available");
      }

      const response = await axiosInstance.post(
        `${ENDPOINTS.AUTH}/refresh-token`,
        { refreshToken: refreshToken }
      );

      if (response && response.isSuccess && response.value) {
        const { accessToken, refreshToken: newRefreshToken } = response.value;

        if (accessToken && newRefreshToken) {
          tokenStorage.storeTokens(accessToken, newRefreshToken);
        }
      }
      return response;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  },

  // Logout: POST /api/auth/logout
  logout: async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) return true;

      const result = await axiosInstance.post(
        `${ENDPOINTS.AUTH}/revoke-token`,
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${tokenStorage.getAccessToken()}`,
          },
        }
      );
      tokenStorage.clearTokens();
      return result;
    } catch (error) {
      console.error("Logout request failed:", error);
      tokenStorage.clearTokens();
      return true;
    }
  },

  resetPassword: async (resetData) => {
    if (
      !resetData ||
      !resetData.token ||
      !resetData.newPassword ||
      !resetData.confirmPassword
    ) {
      throw new Error("Token and new password are required");
    }
    if (resetData.newPassword !== resetData.confirmPassword) {
      throw new Error("Passwords must match");
    }

    return await axiosInstance.post(`/api/reset-password`, {
      token: resetData.token,
      newPassword: resetData.newPassword,
      confirmPassword: resetData.confirmPassword,
    });
  },

  forgotPassword: async (email) => {
    if (!email) {
      throw new Error("Email is required");
    }
    return await axiosInstance.post(`/api/password-reset-email/send`, {
      email,
    });
  },
};

export default authService;
