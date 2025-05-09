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
      `${ENDPOINTS.EXTRACT_USER_ROLES}${userId}`
    );

    // Just return the value array directly
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

  /*
  Example response to ask BE
  {
    "success": true,
    "message": "User role updated successfully",
    "data": {
      "userId": 5,
      "stableId": 1,
      "role": 0
    }
  } 
*/
  updateUserStableRole: async (userId, stableId, role) => {
    return await axiosInstance.put(`/api/user/role/${userId}`, {
      stableId,
      role,
    });
  },
};

export default userService;
