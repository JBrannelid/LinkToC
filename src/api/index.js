// Export services
import eventService from "./services/eventService";
import stableService from "./services/stableService";
import stablePostService from "./services/stablePostService";
import horseService from "./services/horseService";
<<<<<<< HEAD
import horseService from "./services/horseService";
=======
import stableService from "./services/stableService";
import stablePostService from "./services/stablePostService";
>>>>>>> origin

// Export endpoint configurations
import { ENDPOINTS } from "./services/endPoints";

// Export error handling utilities
import { ErrorTypes, createError, handleAxiosError } from "./utils/errors";

// Export all services from a single point
export {
  // Services
  eventService,
<<<<<<< HEAD
  horseService,
=======
  stableService,
  stablePostService,
>>>>>>> origin
  stableService,
  stablePostService,
  horseService,

  // Endpoint configurations
  ENDPOINTS,

  // Error handling utilities
  ErrorTypes,
  createError,
  handleAxiosError,
};
