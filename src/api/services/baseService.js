import axiosConfig from "../config/axiosConfig";
import { createError, ErrorTypes } from "../utils/errors";

export default function createBaseService(endpoint) {
  return {
    // GET all resourcesgetById: async (id) => {
    //       try {
    //         if (!id) {
    //           throw createError("ID is required", ErrorTypes.VALIDATION, 400);
    //         }
    //         return await axiosConfig.get(`${endpoint}/${id}`);
    //       } catch (error) {
    //         console.error(`Error fetching item with ID ${id}:`, error);
    //         throw error;
    //       }
    //     },
    getAll: async () => {
      try {
        return await axiosConfig.get(endpoint);
      } catch (error) {
        console.error(`Error fetching all from ${endpoint}:`, error);
        throw error;
      }
    },

    // GET by ID
    
    // CREATE
    create: async (data) => {
      try {
        if (!data) {
          throw createError("Data is required", ErrorTypes.VALIDATION, 400);
        }
        return await axiosConfig.post(endpoint, data);
      } catch (error) {
        console.error(`Error creating item at ${endpoint}:`, error);
        throw error;
      }
    },

    // UPDATE
    update: async (id, data) => {
      try {
        if (!id) {
          throw createError("ID is required", ErrorTypes.VALIDATION, 400);
        }
        if (!data) {
          throw createError("Data is required", ErrorTypes.VALIDATION, 400);
        }
        return await axiosConfig.put(`${endpoint}/${id}`, data);
      } catch (error) {
        console.error(`Error updating item with ID ${id}:`, error);
        throw error;
      }
    },

    // DELETE
    delete: async (id) => {
      try {
        if (!id) {
          throw createError("ID is required", ErrorTypes.VALIDATION, 400);
        }
        return await axiosConfig.delete(`${endpoint}/${id}`);
      } catch (error) {
        console.error(`Error deleting item with ID ${id}:`, error);
        throw error;
      }
    },
  };
}
