import createBaseService from "./baseService";
import { ENDPOINTS } from "./endpoints";
import axiosInstance from "../config/axiosConfig";

const baseService = createBaseService(ENDPOINTS.STABLE_HORSES);

const stableHorseService = {
  ...baseService, // baseService will handle validation of data

  getStableHorsesbyStableId: async (stableId) => {
    return await axiosInstance.get(
      `${ENDPOINTS.STABLE_HORSES}/${stableId}/horses/with-owners`
    );
  },
};

export default stableHorseService;
