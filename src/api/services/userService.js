import axiosInstance from "../config/axiosConfig";
import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.USERS);

const userService = {
  ...baseService,

  // Aske BE for endpoint responsibole for: fetch all stables and roles for a specific user
  //   { stableIdFk: 101, role: 'admin' },
  //   { stableIdFk: 102, role: 'viewer' }
  getUserStables: async (userId) => {
    return await axiosInstance.get(
      `${ENDPOINTS.USERS}/getUserStables/${userId}`
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
