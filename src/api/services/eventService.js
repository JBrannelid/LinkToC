import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endPoints";

// Create base service with standard CRUD operations
const baseService = createBaseService(ENDPOINTS.EVENTS);

const eventService = {
  ...baseService,

  // Implement event-specific method
};

export default eventService;
