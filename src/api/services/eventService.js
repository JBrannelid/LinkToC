import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";

const baseService = createBaseService(ENDPOINTS.EVENTS);

// We need backend to filter events by stable ID
// getStableEvents have a temporary solution and return all events for now
const eventService = {
  ...baseService,

  getStableEvents: async (stableId) => {
    const allEvents = await eventService.getAll();
    console.log(
      `Retrieved ${allEvents.length} events - displaying all since stableIdFk is not provided by backend`
    );

    return allEvents;
  },

  create: async (data) => {
    const createData = {
      title: data.title,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      stableIdFk: data.stableIdFk || 2, // Default to stable 2 to match my local db
    };

    return await baseService.create(createData);
  },

  update: async (data) => {
    const updateData = {
      id: data.id,
      title: data.title,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      stableIdFk: data.stableIdFk || 2, // Default to stable 2 to match my local db
    };

    return await baseService.update(updateData);
  },
};

export default eventService;
