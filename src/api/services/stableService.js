import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";
import axiosInstance from "../config/axiosConfig";

const baseService = createBaseService(ENDPOINTS.STABLE);

const stableService = {
  ...baseService,

  // Fetches stables based on search term and pagination parameters.
  searchStables: async (params) => {
    // Build the query string from the search parameters.
    const queryParams = new URLSearchParams({
      searchTerm: params.searchTerm || "",
      page: params.page || 0,
      pageSize: params.pageSize || 10,
    });

    // Send GET request to the stables endpoint with query parameters.
    const response = await axiosInstance.get(
      `${ENDPOINTS.STABLE}?${queryParams}`
    );

    if (response && response.isSuccess && Array.isArray(response.value)) {
      return response.value;
    }

    return [];
  },

  createWithWallPost: async (data) => {
    if (!data || !data.name) {
      throw new Error("Stable name is required");
    }

    return await axiosInstance.post(
      `${ENDPOINTS.STABLE}/create-with-wall-post`,
      data
    );
  },

  // Get requests for a stable
  getStableRequests: async (stableId) => {
    const response = await axiosInstance.get(
      `${ENDPOINTS.STABLE_REQUESTS}/${stableId}`
    );

    if (response && response.isSuccess && Array.isArray(response.value)) {
      return {
        received: response.value,
        sent: [],
      };
    }

    return { received: [], sent: [] };
  },

  // Get invites from a stable to a user
  getStableInvites: async (stableId) => {
    const response = await axiosInstance.get(
      `${ENDPOINTS.STABLE_INVITES}/${stableId}`
    );

    if (response && response.isSuccess && Array.isArray(response.value)) {
      return response.value;
    }

    return [];
  },

  // For rejecting an application request from a user to join the stable
  rejectStableJoinRequest: async (requestData) => {
    return await axiosInstance.post(
      `/api/refuse-stable-join-request`,
      requestData
    );
  },

  // For canceling an invitation that the stable sent to a user
  cancelStableInvite: async (inviteData) => {
    return await axiosInstance.post(`/api/refuse-stable-invite`, inviteData);
  },

  // Accept a stable join request
  acceptStableJoinRequest: async (requestData) => {
    return await axiosInstance.post(
      `/api/accept-stable-join-request`,
      requestData
    );
  },
};

export default stableService;
