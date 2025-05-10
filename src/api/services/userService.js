import axiosInstance from "../config/axiosConfig";
import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.USERS);

const userService = {
  ...baseService,

  getUserStables: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/api/user-stables/user/${userId}`
      );
      return response.value || [];
    } catch (error) {
      // Handel expected 404 error when user has no stables yet
      if (
        error.statusCode === 404 ||
        (error.message && error.message.includes("User has no stables yet")) ||
        (error.message &&
          error.message.includes("not connected to any stables"))
      ) {
        console.info(
          `User has no stable roles yet - this is normal for new users`
        );
        return []; // Return empty array
      }
      // Logga endast oväntade fel
      console.error("Error fetching user stables:", error);
      throw error;
    }
  },

  getById: async (id) => {
    return await baseService.getById(id);
  },

  update: async (userData) => {
    return await baseService.update(userData);
  },
  delete: async (userId) => {
    return await baseService.delete(userId);
  },

  updateUserStableRole: async (userStableId, role) => {
    return await axiosInstance.put(
      `${ENDPOINTS.EXTRACT_USER_ROLES}stable-user/${userStableId}?UpdateStableUserRole=${role}`
    );
  },

  removeUserFromStable: async (userStableId) => {
    return await axiosInstance.delete(
      `${ENDPOINTS.DELETE_USER_FROM_STABLE}/${userStableId}`
    );
  },
};

export default userService;
