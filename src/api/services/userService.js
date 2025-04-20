import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

// baseService will handle validation of data
const baseService = createBaseService(ENDPOINTS.USERS);

const userService = {
  ...baseService,

  // Get user base on a specifik stable Id
  getStableUsers: async (stableId) => {
    const users = await baseService.getAll();
    // Filtering user by stable-Id should be handle by backend
    return users.filter((user) => user.stableIdFk === stableId);
  },

  createUser: async (userData, stableId) => {
    const createData = {
      ...userData,
      stableIdFk: stableId,
    };

    return await baseService.create(createData);
  },
};

export default userService;
