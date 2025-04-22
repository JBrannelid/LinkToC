// Export services
import eventService from "./services/eventService";
import stableService from "./services/stableService";
import stablePostService from "./services/stablePostService";

// Export endpoint configurations
import { ENDPOINTS } from "./services/endPoints";

// Export error handling utilities
import { ErrorTypes, createError, handleAxiosError } from "./utils/errors";

// Export all services from a single point
export {
  // Services
  eventService,
  stableService,
  stablePostService,

  // Endpoint configurations
  ENDPOINTS,

  // Error handling utilities
  ErrorTypes,
  createError,
  handleAxiosError,
};