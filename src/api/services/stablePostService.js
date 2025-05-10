import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";
import axiosInstance from "../config/axiosConfig";

const baseService = createBaseService(ENDPOINTS.STABLEPOST);

const stablePostService = {
  ...baseService,

  // Get all stable posts on a specific stable ID
  getStablePosts: async (stableId) => {
    const response = await axiosInstance.get(
      `${ENDPOINTS.STABLEPOSTBYID}${stableId}`
    );

    if (response && response.isSuccess && Array.isArray(response.value)) {
      return response.value;
    }

    return [];
  },

  // Create a new stable post
  create: async (data) => {
    const createData = {
      userIdFk: data.userIdFk,
      stableIdFk: data.stableIdFk,
      title: data.title,
      content: data.content,
      date: data.date || new Date().toISOString(),
      isPinned: data.isPinned || false,
    };

    return await axiosInstance.post(
      `${ENDPOINTS.STABLEPOST}/create`,
      createData
    );
  },

  // Update an excisting stable post
  update: async (data) => {
    const updateData = {
      id: data.id,
      title: data.title,
      content: data.content,
    };

    return await axiosInstance.put(
      `${ENDPOINTS.STABLEPOST}/update`,
      updateData
    );
  },

  // Delete a stable post by ID
  delete: async (id) => {
    return await axiosInstance.delete(`${ENDPOINTS.STABLEPOST}/delete/${id}`);
  },

  // Pin toggler (true/false) by a stable post
  togglePin: async (postId) => {
    return await axiosInstance.patch(
      `${ENDPOINTS.STABLEPOST}/is-pinned/change/${postId}`
    );
  },
};

export default stablePostService;
