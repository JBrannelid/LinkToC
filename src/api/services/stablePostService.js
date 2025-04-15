import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endPoints";

const baseService = createBaseService(ENDPOINTS.STABLEPOST);

const stablePostService = {
  ...baseService,

  create: async (data) => {
    // baseService will handle validation of data

    const createData = {
      title: data.title,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      stableIdFk: 1, // Default value since we're not handling stable foreign key atm.
    };

    return await baseService.create(createData);
  },

  update: async (data) => {
    const updateData = {
      id: data.id,
      title: data.title,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      stableIdFk: data.stableIdFk || 1,
    };

    console.log("Sending update data:", JSON.stringify(updateData));
    return await baseService.update(updateData);
  },

  // Implement event-specific method to ensure DTO formatting
};

export default stablePostService;
