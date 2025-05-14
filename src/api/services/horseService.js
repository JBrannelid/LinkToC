import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";
import {createError, ErrorTypes} from "../utils/errors.js";
import axiosInstance from "../config/axiosConfig.js";

// Create base service with standard CRUD operations
const baseService = createBaseService(ENDPOINTS.HORSES);

const horseService = {
  ...baseService,

  // Implement event-specific method
  create: async (data) => {
    try {
      if (!data) {
        throw createError("Data is required", ErrorTypes.VALIDATION, 400);
      }
      const createData = {
        name: data.name,
        age: data.age,
        breed: data.breed,
        color: data.color,
      };

      return await baseService.create(createData);
    } catch (error) {
      console.error(`Error creating item at ${ENDPOINTS.HORSES}:`, error);
      throw error;
    }
  },
  getHorsesByStableId: async (stableId) => {
    try {
      const response = await axiosInstance.get(`/api/stable-horses/${stableId}`);
      console.log("Raw API response:", response);

      // Based on your API response format, extract the horses array
      let horses = [];

      if (response?.data?.value && Array.isArray(response.data.value)) {
        horses = response.data.value;
      } else if (response?.data && Array.isArray(response.data)) {
        horses = response.data;
      } else if (response?.value && Array.isArray(response.value)) {
        horses = response.value;
      } else {
        console.warn("Could not extract horses array from response:", response);
        return [];
      }

      console.log(`Extracted ${horses.length} horses from API response:`, horses);
      return horses;
    } catch (error) {
      console.error(`Error fetching horses for stable ${stableId}:`, error);
      throw error;
    }
  },
  getHorsesWithOwners: async (stableId) => {
    try {
      const response = await axiosInstance.get(`/api/stables/${stableId}/horses/with-owners`);
      

      if (response?.data?.value && Array.isArray(response.data.value)) {
        return response.data.value;
      } else if (response?.value && Array.isArray(response.value)) {
        return response.value;
      } else {
        console.warn("Unexpected response format from horses/with-owners endpoint");
        return [];
      }
    } catch (error) {
      
      if (error.status === 404 || error.response?.status === 404) {
        
        if (error.details?.message?.includes("No horses") ||
            error.response?.data?.details?.message?.includes("No horses")) {
          console.log("No horses found for this stable - returning empty array");
          return []; 
        }
      }

      console.error(`Error fetching horses with owners for stable ${stableId}:`, error);
      throw error;
    }
  },
  removeHorseFromStable: async (stableHorseId) => {
    try {
      const response = await axiosInstance.get(`/api/stable-horse/remove-horse/${stableHorseId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing horse from stable:", error);
      throw error;
    }
  },
  createHorseComposition: async (compositionData) => {
    if (!compositionData || !compositionData.horse || !compositionData.stableId || !compositionData.userId) {
      throw new Error("Horse, stable ID, and user ID are required");
    }

    try {
      return await axiosInstance.post(`/api/horse/create/composition`, compositionData);
    } catch (error) {
      console.error("Error creating horse composition:", error);
      throw error;
    }
  },
  addHorse: async (horseData) => {
    return await baseService.create(horseData);
  },
  updateHorse: async (horseData, horseId) => {
    return await baseService.update({...horseData, id: horseId});
  },
  deleteHorse: async (horseId) => {
    return await baseService.delete(horseId);
  },
  getHorseById: async (horseId) => {
    return await baseService.getById(horseId);
  },
  
};



export default horseService;
