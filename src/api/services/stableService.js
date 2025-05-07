import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";
import axiosConfig from "../config/axiosConfig.js";
import axiosInstance from "../config/axiosConfig.js";

const baseService = createBaseService(ENDPOINTS.STABLE);

const stableService = {
  ...baseService,
  
  search: async (params) => {
    try {
      const searchParams = {
        searchTerm: params.searchTerm || '',
        page: params.page || 0,
        pageSize: params.pageSize || 10,
      };
      
      const queryString = Object.entries(searchParams)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
      return await axiosInstance.get(`${ENDPOINTS.STABLE}/search?${queryString}`);
    } catch (error) {
      console.error("Error searching for stables:", error);
      throw error;
    }
  },
  createWithWallPost: async (data) => {
    if (!data || !data.name) {
      throw new Error("Stable name is required");
    }

    return await axiosInstance.post(`${ENDPOINTS.STABLE}/create-with-wall-post`, data);
  },
};

export default stableService;
