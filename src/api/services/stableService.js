import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.STABLE);

const stableService = {
  ...baseService,

  // Implement stable-specific method
};

export default stableService;
