import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endPoints";
import axiosInstance from "../config/axiosConfig";

const baseService = createBaseService(ENDPOINTS.WALLPOST);

const wallPostService = {
  ...baseService, // baseService will handle validation of data

  create: async (data) => {
    if (!data.stableIdFk) {
      throw new Error("stableId is required");
    }

    const createData = {
      stableIdFk: data.stableIdFk,
      title: "",
      body: "",
    };
    console.log("Sending to Backend", createData);
    return await axiosInstance.post(
      `${ENDPOINTS.WALLPOST}/create?stableId=${data.stableIdFk}`,
      createData
    );
  },

  getById: async (stableId) => {
    if (!stableId) {
      throw new Error("Stable ID is required");
    }
    return await axiosInstance.get(`/api/wallpost/${stableId}`);
  },

  update: async (data) => {
    const updateData = {
      stableIdFk: data.stableIdFk,
      title: data.title,
      body: data.body,
    };

    return await axiosInstance.patch(`${ENDPOINTS.WALLPOST}/edit`, updateData);
  },

  replace: async (data) => {
    const replaceData = {
      stableIdFk: data.stableIdFk,
      title: data.title,
      body: data.body,
    };

    return await axiosInstance.put(
      `${ENDPOINTS.WALLPOST}/replace`,
      replaceData
    );
  },
};

export default wallPostService;
