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
  /*
  "success": true,
  "data": {
    "received": [
      {
        "id": 12,
        "userId": 8,
        "firstName": "Jenny",
        "lastName": "Jennysson",
        "email": "jenny@example.com",
        "requestDate": "2025-04-25T14:30:00"
      },
    "sent": [
      {
        "id": 18,
        "stableId": 3,
        "stableName": "Ridskolan Pegasus",
        "requestDate": "2025-04-28T11:20:00",
        "status": "pending"
      }
    ]
  }
  */
  getStableRequests: async (stableId) => {
    return await axiosInstance.get(`/api/stable/${stableId}/requests`); // Follow rest convention hierarchy
  },

  // Handle a request (approve/reject)
  /*
  "success": true,
  "message": "Request approved successfully",
  "data": {
    "requestId": 12,
    "userId": 8,
    "stableId": 1,
    "status": "approved" // approved or "reject"
  }
 */
  handleStableRequest: async (requestId, action) => {
    return await axiosInstance.put(`/api/stable/request/${requestId}`, {
      // REST APIs for state transitions
      action: action,
    });
  },

  // Remove a user from stable
  /*
  "success": true,
  "message": "User removed from stable successfully",
  "data": {
    "userId": 8,
    "stableId": 1
 */
  removeUserFromStable: async (stableId, userId) => {
    return await axiosInstance.delete(
      `/api/userstables/${stableId}/user/${userId}`
    );
  },
};

export default stableService;
