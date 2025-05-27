import createBaseService from "./baseService";
import { ENDPOINTS } from "./endPoints.js";
import axiosInstance from "../config/axiosConfig.js";
import { createError, ErrorTypes } from "../utils/errors.js";

// Create base service with standard CRUD operations
const baseService = createBaseService(ENDPOINTS.HORSES);

const horseService = {
  ...baseService,

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

  getHorsesWithOwnersByStable: async (stableId) => {
    const response = await axiosInstance.get(
      `${ENDPOINTS.STABLE_HORSES}/${stableId}/horses/with-owners`
    );
    return response.value || [];
  },

  getHorseProfile: async (horseId) => {
    if (!horseId) {
      console.warn("Horse ID is required to fetch profile");
      return { isSuccess: false, message: "Horse ID is required" };
    }
    return await axiosInstance.get(`/api/horse/${horseId}/profile`);
  },

  getHorsesByStableId: async (stableId) => {
    const response = await axiosInstance.get(`/api/stable-horses/${stableId}`);

    if (response?.data?.value && Array.isArray(response.data.value)) {
      return response.data.value;
    } else if (response?.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response?.value && Array.isArray(response.value)) {
      return response.value;
    }

    console.warn("Could not extract horses array from response:", response);
    return [];
  },

  removeHorseFromStable: async (stableHorseId) => {
    try {
      const response = await axiosInstance.get(
        `/api/stable-horse/remove-horse/${stableHorseId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing horse from stable:", error);
      throw error;
    }
  },

  // Remove try-catch, keep validation
  createHorseComposition: async (compositionData) => {
    if (
      !compositionData ||
      !compositionData.horse ||
      !compositionData.stableId ||
      !compositionData.userId
    ) {
      throw new Error("Horse, stable ID, and user ID are required");
    }
    return await axiosInstance.post(
      `/api/horse/create/composition`,
      compositionData
    );
  },

  addHorse: async (horseData) => {
    return await baseService.create(horseData);
  },

  updateHorse: async (horseData, horseId) => {
    return await baseService.update({ ...horseData, id: horseId });
  },

  deleteHorse: async (horseId) => {
    return await baseService.delete(horseId);
  },

  getHorseById: async (horseId) => {
    return await baseService.getById(horseId);
  },
};

export default horseService;
