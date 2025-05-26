import axiosInstance from "../config/axiosConfig";
import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endPoints.js";

const baseService = createBaseService(ENDPOINTS.EVENTS);
const eventService = {
  ...baseService,

  // Retrieve events belonging to a stableId
  getStableEvents: async (stableId) => {
    const response = await axiosInstance.get(
      `${ENDPOINTS.EVENTS_BY_STABLE}/${stableId}`
    );
    return response?.value || [];
  },

  create: async (data) => {
    const createData = {
      title: data.title,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      stableIdFk: data.stableIdFk,
      userIdFk: data.userIdFk,
    };

    return await baseService.create(createData);
  },

  update: async (data) => {
    const updateData = {
      id: data.id,
      title: data.title,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      userIdFk: data.userIdFk,
    };

    return await baseService.update(updateData);
  },
};

export default eventService;
