import axiosInstance from "../config/axiosConfig";
import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.EVENTS);
const eventService = {
  ...baseService,

  // Retrive events belong to a stableId
  getStableEvents: async (stableId) => {
    try {
      const response = await axiosInstance.get(
        `${ENDPOINTS.EVENTS_BY_STABLE}/${stableId}`
      );

      if (response && response.isSuccess && Array.isArray(response.value)) {
        return response.value;
      }

      return [];
    } catch (error) {
      console.error("Error fetching events by stable ID:", error);
      return [];
    }
  },

  create: async (data) => {
    const createData = {
      title: data.title,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      stableIdFk: data.stableIdFk,
      userIdFk: data.userIdFk || 1, // Default to user 1
    };

    console.log("Creating event with data:", createData);
    return await baseService.create(createData);
  },

  update: async (data) => {
    const updateData = {
      id: data.id,
      title: data.title,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      // stableIdFk: data.stableIdFk,
      userIdFk: data.userIdFk || 1, // Default to user 1
      // är anv superadmin eller är användare samma anv som skapade eventet?
    };

    console.log("Updating event with data:", updateData);
    return await baseService.update(updateData);
  },
};

export default eventService;
