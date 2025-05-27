// Export services
import authService from "./services/authService";
import { ENDPOINTS } from "./services/endPoints";
import eventService from "./services/eventService";
import horseService from "./services/horseService";
import stableHorseService from "./services/stableHorseService";
import stablePostService from "./services/stablePostService";
import stableService from "./services/stableService";
import userService from "./services/userService";

// Export endpoint configurations

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
