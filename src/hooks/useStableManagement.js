// In hooks/useStableManagement.js
import { useState, useCallback, useEffect } from "react";
import { useLoadingState } from "./useLoadingState";
import stableService from "../api/services/stableService";
import userService from "../api/services/userService";

export const useStableManagement = (stableId) => {
  const [members, setMembers] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  const loadingState = useLoadingState(loading, operationType);

  // Fetch members and requests in a single function
  const fetchStableData = useCallback(async () => {
    if (!stableId) return;

    setLoading(true);
    setOperationType("fetch");

    try {
      // Fetch members from existing endpoint
      const userResponse = await userService.getUserStables(stableId);
      setMembers(Array.isArray(userResponse) ? userResponse : []);

      // Fetch requests for a specifik stable
      const requestsResponse = await stableService.getStableRequests(stableId);

      setReceivedRequests(requestsResponse.received || []);
      setSentRequests(requestsResponse.sent || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching stable data:", error);
      setError(error.message || "Failed to load stable data");
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  // Stable Member management functions
  const updateMemberRole = async (userId, newRole) => {
    setLoading(true);
    setOperationType("update");

    try {
      await userService.updateUserStableRole(userId, stableId, newRole);
      await fetchStableData();
      return true;
    } catch (error) {
      setError(error.message || "Failed to update member role");
      setLoading(false);
      return false;
    }
  };

  const removeMember = async (userId) => {
    setLoading(true);
    setOperationType("delete");

    try {
      await stableService.removeUserFromStable(stableId, userId);
      await fetchStableData();
      return true;
    } catch (error) {
      setError(error.message || "Failed to remove member");
      setLoading(false);
      return false;
    }
  };

  // Request management functions
  const handleRequest = async (requestId, action) => {
    setLoading(true);
    setOperationType("update");

    try {
      await stableService.handleStableRequest(requestId, action);
      await fetchStableData();
      return true;
    } catch (error) {
      setError(error.message || "Failed to process request");
      setLoading(false);
      return false;
    }
  };

  const approveRequest = (requestId) => handleRequest(requestId, "approve");
  const rejectRequest = (requestId) => handleRequest(requestId, "reject");

  useEffect(() => {
    fetchStableData();
  }, [fetchStableData]);

  return {
    // Data
    members,
    receivedRequests,
    sentRequests,

    // Status
    loading,
    error,
    loadingState,

    // Functions
    updateMemberRole,
    removeMember,
    approveRequest,
    rejectRequest,
    refreshData: fetchStableData,
  };
};
