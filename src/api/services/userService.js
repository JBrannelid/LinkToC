import axiosInstance from "../config/axiosConfig";
import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.USERS);

const userService = {
  ...baseService,

  // Fetching a specific user's role for a given stable
  // Example response: { stableIdFk: 1, Role: 0 }
  getUserStableRole: async (userId, stableId) => {
    if (!userId || !stableId) {
      throw new Error("User ID and Stable ID are required");
    }
    return await axiosInstance.get(
      `${ENDPOINTS.USERS}/${userId}/stables/${stableId}/role`
    );
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
};

export default userService;
