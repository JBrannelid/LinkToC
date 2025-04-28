import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";
import axiosConfig from "../config/axiosConfig";

const baseService = createBaseService(ENDPOINTS.WALLPOST);

const wallPostService = {
  ...baseService,

  create: async (data) => {
    // baseService will handle validation of data

    const createData = {
      title: data.title,
      body: data.body,
      stableIdFk: data.stableIdFk,
    };

    return await baseService.create(createData);
  },

  getById: async (stableId) => {
    if (!stableId) {
      throw new Error("Stable ID is required");
    }

    return await axiosConfig.get(`/api/wallpost/${stableId}`);
  },

  update: async (data) => {
    const updateData = {
      id: data.id,
      title: data.title,
      body: data.body,
      lastEdited: new Date().toISOString(),
      stableIdFk: data.stableIdFk,
    };

    return await baseService.update(updateData);
  },
};

export default wallPostService;
