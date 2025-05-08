import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endpoints";
import axiosInstance from "../config/axiosConfig";

const baseService = createBaseService(ENDPOINTS.STABLE);

const stableService = {
  ...baseService,

  search: async (params) => {
    try {
      // Build query-string from searchParams
      const searchParams = {
        searchTerm: params.searchTerm || "",
        page: params.page || 0,
        pageSize: params.pageSize || 10,
      };

      const queryString = Object.entries(searchParams)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      // Send GET-request
      const response = await axiosInstance.get(
        `${ENDPOINTS.STABLE}/search?${queryString}`
      );

      // Handle response and return value if the response is sucess
      if (response && response.isSuccess && Array.isArray(response.value)) {
        return response.value;
      }

      return [];
    } catch (error) {
      console.error("Error searching for stables:", error);
      return [];
    }
  },

  createWithWallPost: async (data) => {
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

  // Awaiting backend implementation to recives stable invites by user id
  // getStableInvitesByUserId: async (userId) => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `/api/get-stable-invites-by-user/${userId}`
  //     );

  //     if (response && response.isSuccess && Array.isArray(response.value)) {
  //       return response.value;
  //     }

  //     return [];
  //   } catch (error) {
  //     console.error("Error fetching user stable invites:", error);
  //     throw error;
  //   }
  // },

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

  // GET all join request ask by the User
  getUserStableRequests: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/api/get-stable-join-requests-by-user/${userId}`
      );

      // The API returns data in the 'value' property
      if (response && response.isSuccess && Array.isArray(response.value)) {
        return response.value;
      }

    return await axiosConfig.post(`${ENDPOINTS.STABLE}/create-with-wall-post`, data);
  },
};

export default stableService;
