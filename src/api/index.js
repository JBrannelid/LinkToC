// Export services
import eventService from "./services/eventService";
import stableService from "./services/stableService";
import stablePostService from "./services/stablePostService";
import horseService from "./services/horseService";
import authService from "./services/authService";
import userService from "./services/userService";
import stableHorseService from "./services/stableHorseService";

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
  horseService,
  userService,
  authService,
  stableHorseService,

  // Endpoint configurations
  ENDPOINTS,

  // Error handling utilities
  ErrorTypes,
  createError,
  handleAxiosError,
};
