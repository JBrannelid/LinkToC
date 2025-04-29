import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.STABLE);

const stableService = {
  ...baseService,
  
  
  createWithWallPost: async (data) => {
    if (!data || !data.name) {
      throw new Error("Stable name is required");
    }

    return await baseService.post(`${ENDPOINTS.STABLE}/create-with-wall-post`, data);
  },
};

export default stableService;
