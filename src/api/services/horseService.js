import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";
import { createError } from "../utils/errors.js";

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
};

export default horseService;
