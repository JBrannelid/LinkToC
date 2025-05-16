import createBaseService from "./baseService.js";
import { ENDPOINTS } from "./endPoints.js";
import axiosInstance from "../config/axiosConfig";
import tokenStorage from "../../utils/tokenStorage.js";
import { getErrorMessage } from "../../utils/errorUtils.js";

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
      const errorMessage = getErrorMessage(error, {
        defaultMessage: "Login failed. Please try again.",
        customMessages: {
          // Add specific error message mappings if needed
          "Invalid credentials": "Invalid username or password. Please try again."
        }
      });
      throw new Error(errorMessage.text);
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
  
  logoutAndDeleteUser: async (userId) => {
    if(!userId) {
      throw new Error("User ID is required");
    }
    try {
      const accessToken = tokenStorage.getAccessToken();
      await authService.logout();

      const result = await axiosInstance.delete(`${ENDPOINTS.USERS}/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      sessionStorage.removeItem("currentUser")
      localStorage.removeItem("currentStable")
      
      return result;
    } catch (error) {
      console.error("Logout and delete user request failed:", error);
      
      tokenStorage.clearTokens();
      
      throw error;
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

  changePassword: async (changeData) => {
    if (
      !changeData ||
      !changeData.userId ||
      !changeData.newPassword ||
      !changeData.confirmPassword
    ) {
      throw new Error("User ID and passwords are required");
    }

    return await axiosInstance.post(ENDPOINTS.CHANGE_PASSWORD, {
      userId: changeData.userId,
      newPassword: changeData.newPassword,
      confirmPassword: changeData.confirmPassword,
    });
  },
};

export default authService;
