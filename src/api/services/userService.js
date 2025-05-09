import axiosInstance from "../config/axiosConfig";
import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.USERS);

const userService = {
  ...baseService,

  // Example response:  { "stableIdFk": 1, "role": 0 }
  getUserStables: async (userId) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // The axios interceptor will handle the response formatting and error handling
    const response = await axiosInstance.get(
      `${ENDPOINTS.EXTRACT_USER_ROLES}user/${userId}`
    );

    return response.value;
  },

  getUsersByStableId: async (stableId) => {
    const response = await axiosInstance.get(
      `${ENDPOINTS.EXTRACT_USER_ROLES}stable/${stableId}`
    );

    return response.value;
  },

  getById: async (id) => {
    if (!id) {
      throw new Error("User ID is required");
    }

    return await baseService.getById(id);
  },

  update: async (userData) => {
    if (!userData || !userData.id) {
      throw new Error("User ID is required for update");
    }

    return await baseService.update(userData);
  },
  delete: async (userId) => {
    if (!userId) {
      throw new Error("User ID is required for deletion");
    }

    return await baseService.delete(userId);
  },

  updateUserStableRole: async (userStableId, role) => {
    console.log(
      `Updating role for userStableId: ${userStableId} to role: ${role}`
    );

    return await axiosInstance.put(
      `${ENDPOINTS.EXTRACT_USER_ROLES}stable-user/${userStableId}?userStableRole=${role}`
    );
  },
};

export default userService;
