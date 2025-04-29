import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.USERS);

const userService = {
  ...baseService,

  // Get user base on a specifik stable Id
  getStableUsers: async (stableId) => {
    const users = await baseService.getAll();

    // Filtering user by stable-Id should be handle by backend?
    return users.filter((user) => user.stableIdFk === stableId);
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
