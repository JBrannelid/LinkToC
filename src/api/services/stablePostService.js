import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";
import axiosConfig from "../config/axiosConfig";

const baseService = createBaseService(ENDPOINTS.STABLEPOST);

const stablePostService = {
  ...baseService,

  getStablePosts: async (stableId) => {
    const response = await axiosConfig.get(
      `${ENDPOINTS.STABLEPOST}/stable/${stableId}`
    );

    if (response && response.isSuccess && Array.isArray(response.value)) {
      return response.value;
    }

    return [];
  },

  create: async (data) => {
    if (!data) {
      throw new Error("Post data is required");
    }

    const createData = {
      userIdFk: data.userIdFk,
      stableIdFk: data.stableIdFk,
      title: data.title,
      content: data.content,
      date: data.date || new Date().toISOString(),
      isPinned: data.isPinned || false,
    };

    return await baseService.create(createData);
  },

  update: async (data) => {
    const updateData = {
      id: data.id,
      title: data.title,
      content: data.content,
      isPinned: data.isPinned,
    };
    return await baseService.update(updateData);
  },
};

export default stablePostService;
