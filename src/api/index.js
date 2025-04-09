// Export services
import eventService from "./services/eventService";

// Export endpoint configurations
import { ENDPOINTS } from "./services/endPoints";

// Export error handling utilities
import { ErrorTypes, createError, handleAxiosError } from "./utils/errors";

// Export all services from a single point
export {
  // Services
  eventService,

  // Endpoint configurations
  ENDPOINTS,

  // Error handling utilities
  ErrorTypes,
  createError,
  handleAxiosError,
};
