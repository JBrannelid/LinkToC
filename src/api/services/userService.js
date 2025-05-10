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

    try{
      // The axios interceptor will handle the response formatting and error handling     
      const response = await axiosInstance.get(
          `${ENDPOINTS.EXTRACT_USER_ROLES}${userId}`
      );
      console.log('User roles response:', response);
      
      return response.value || [];
    } catch (error) {
      if (error.message && error.message.includes('not connected to any stables') ||
          error.status === 404) {
        console.log('User has no stables yet - returning empty array');
        return []; // Return empty array instead of throwing an error
      }
      console.error('Error fetching user stables:', error);
      throw error;
    }
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
