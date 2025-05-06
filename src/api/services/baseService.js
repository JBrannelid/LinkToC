import axiosInstance from "../config/axiosConfig";
import { createError, ErrorTypes } from "../utils/errors";

export default function createBaseService(endpoint) {
  return {
    // GET: /{ENDPOINTS}
    getAll: async () => {
      const response = await axiosInstance.get(endpoint);

      // Handle the specific response format
      if (response && response.isSuccess && Array.isArray(response.value)) {
        return response.value;
      }

      return [];
      //  Axios interceptor handle error response and formating
    },

    // GET: /{ENDPOINTS}/{id}
    getById: async (id) => {
      if (!id) {
        throw createError("ID is required", ErrorTypes.VALIDATION, 400);
      }

      return await axiosInstance.get(`${endpoint}/${id}`);
    },

    // POST: /{ENDPOINTS}/create
    create: async (data) => {
      if (!data) {
        throw createError("Data is required", ErrorTypes.VALIDATION, 400);
      }

      return await axiosInstance.post(`${endpoint}/create`, data);
    },

    // PUT: /{ENDPOINTS}/update
    update: async (data) => {
      if (!data) {
        throw createError("Data is required", ErrorTypes.VALIDATION, 400);
      }

      return await axiosInstance.put(`${endpoint}/update`, data);
    },

    // DELETE: {BaseURL}/{ENDPOINTS}/delete/{id}
    delete: async (id) => {
      if (!id) {
        throw createError("ID is required", ErrorTypes.VALIDATION, 400);
      }

      return await axiosInstance.delete(`${endpoint}/delete/${id}`);
    },
  };
}
