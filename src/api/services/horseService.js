import createBaseService from "../services/baseService.js";
import { ENDPOINTS } from "./endPoints";
import { createError } from "../utils/errors.js";
import axiosInstance from "../config/axiosConfig";

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

  getHorsesWithOwnersByStable: async (stableId) => {
    try {
      const response = await axiosInstance.get(
        `/api/stables/${stableId}/horses/with-owners`
      );

      if (response && response.isSuccess && Array.isArray(response.value)) {
        return response.value;
      }

      return [];
    } catch (error) {
      console.error("Error fetching horses with owners:", error);
      throw error;
    }
  },
};

export default horseService;
