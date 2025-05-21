import createBaseService from "../services/baseService";
import { ENDPOINTS } from "./endPoints";
import axiosInstance from "../config/axiosConfig";
import tokenStorage from "../../utils/tokenStorage";

const getUserIdFromToken = () => {
  try {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    // Parse JWT token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);

    // Get user ID from 'sub' claim
    const userId = payload.sub;
    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
};

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
        return {
          success: true,
          data: response.value,
          message: "Search completed successfully",
        };
      }
      if (response && Array.isArray(response)) {
        return {
          success: true,
          data: response,
          message: "Search completed",
        };
      }
      if (response && response.value) {
        return {
          success: true,
          data: Array.isArray(response.value)
            ? response.value
            : [response.value],
          message: "Search completed with partial results",
        };
      }

      return {
        success: false,
        data: [],
        message: "No results found",
      };
    } catch (error) {
      console.error("Error searching for stables:", error);
      return {
        success: false,
        data: [],
        message: error.message || "Search failed",
        error: error,
      };
    }
  },

  createStable: async (stableData) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userId = getUserIdFromToken() || currentUser.id;

    if (!userId) {
      console.error("No userId available for stable creation");
      throw new Error("User ID is required to create a stable");
    }

    if (!stableData.stableName) {
      console.error("stableName is missing from form data");
      throw new Error("Stable name is required");
    }

    // Build the payload based on the field names in the form
    const createData = {
      userId: parseInt(userId, 10), // Radix parameter for safety
      stable: {
        name: stableData.stableName || stableData.name,
        type: stableData.typeOfStable || stableData.type,
        county: stableData.county,
        address: stableData.streetAddress || stableData.address,
        postCode: stableData.postCode,
        boxCount:
          parseInt(stableData.stableBoxes || stableData.boxCount, 10) || 0,
      },
    };

    try {
      const response = await axiosInstance.post(
        `${ENDPOINTS.STABLE}/create`,
        createData
      );

      return response;
    } catch (error) {
      console.error("Stable creation error:", error);

      if (error.details) {
        console.error("Server error details:", error.details);
      }

      throw error;
    }
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

      return [];
    } catch (error) {
      console.error("Error fetching user stable requests:", error);
      throw error;
    }
  },

  // Cancel a ongoing join request
  cancelStableJoinRequest: async (requestData) => {
    return await axiosInstance.post(
      `/api/refuse-stable-join-request`,
      requestData
    );
  },

  // Accept an invitation from a stable
  acceptStableInvite: async (inviteData) => {
    return await axiosInstance.post(`/api/accept-stable-invite`, inviteData);
  },

  // Denied an invitation from a stable
  refuseStableInvite: async (inviteData) => {
    return await axiosInstance.post(`/api/refuse-stable-invite`, inviteData);
  },
  // Create Join Request
  createStableJoinRequest: async (requestData) => {
    return await axiosInstance.post(
      "/api/create-stable-join-request",
      requestData
    );
  },
};

export default stableService;
