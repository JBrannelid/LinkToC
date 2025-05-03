import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";
import axiosConfig from "../config/axiosConfig";

const baseService = createBaseService(ENDPOINTS.WALLPOST);

const wallPostService = {
  ...baseService, // baseService will handle validation of data

  create: async (data) => {
    if (!data.stableIdFk) {
      throw new Error("stableId is required");
    }

    const createData = {
      stableId: data.stableId,
      title: data.title,
      body: data.body,
    };

    return await axiosConfig.post(`${ENDPOINTS.WALLPOST}/create`, createData);
  },

  getById: async (stableId) => {
    if (!stableId) {
      throw new Error("Stable ID is required");
    }
    return await axiosConfig.get(`/api/wallpost/${stableId}`);
  },

  update: async (data) => {
    const updateData = {
      stableIdFk: data.stableIdFk,
      title: data.title,
      body: data.body,
    };

    return await axiosConfig.patch(`${ENDPOINTS.WALLPOST}/edit`, updateData);
  },

  replace: async (data) => {
    const replaceData = {
      stableIdFk: data.stableIdFk,
      title: data.title,
      body: data.body,
    };

    return await axiosConfig.put(`${ENDPOINTS.WALLPOST}/replace`, replaceData);
  },
};

export default wallPostService;
