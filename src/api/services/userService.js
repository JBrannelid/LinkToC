import axiosInstance from "../config/axiosConfig";
import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.USERS);

const userService = {
  ...baseService,

  // Ask BE to get to specifik endpoints
  // 1. /api/user/getUserStables/{userId}
  //  1.a) Example response:  { "stableIdFk": 1, "role": 0 }
  getUserStables: async (userId) => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return await axiosInstance.get(`/api/userstables/user/${userId}`);
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
};

export default userService;
