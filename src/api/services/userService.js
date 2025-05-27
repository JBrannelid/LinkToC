import createBaseService from "./baseService";
import { ENDPOINTS } from "./endPoints";
import axiosInstance from "../config/axiosConfig";

const baseService = createBaseService(ENDPOINTS.USERS);

const userService = {
  ...baseService,

  getUserStables: async (userId) => {
    const response = await axiosInstance.get(
      `/api/user-stables/user/${userId}`
    );
    return response.value || [];
  },

  getUsersByStableId: async (stableId) => {
    const response = await axiosInstance.get(
      `/api/user-stables/stable/${stableId}`
    );
    return response.value || [];
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
      `${ENDPOINTS.EXTRACT_USER_ROLES}stable-user/${userStableId}?userStableRole=${role}`
    );
  },

  removeUserFromStable: async (userStableId) => {
    return await axiosInstance.delete(
      `${ENDPOINTS.DELETE_USER_FROM_STABLE}/${userStableId}`
    );
  },

  getUserProfile: async (userId, stableId) => {
    return await axiosInstance.get(`/api/user/${userId}/stable/${stableId}`);
  },

  setProfilePicture: async (userId, blobName) => {
    return await axiosInstance.post("/api/user/set-profile-picture", {
      userId,
      blobName,
    });
  },
};

export default userService;
