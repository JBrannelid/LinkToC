import { useState, useCallback, useEffect } from "react";
import { useLoadingState } from "./useLoadingState";
import stableService from "../api/services/stableService";
import userService from "../api/services/userService";

export const useStableManagement = (stableId) => {
  const [members, setMembers] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");
  const [sentInvites, setSentInvites] = useState([]);

  const loadingState = useLoadingState(loading, operationType);

  // Fetch members and requests in a single function
  const fetchStableData = useCallback(async () => {
    if (!stableId) return;

    setLoading(true);
    setOperationType("fetch");

    try {
      // Fetch members for a specific stable
      const membersResponse = await userService.getUsersByStableId(stableId);

      // Format response to match expected format
      const formattedMembers = Array.isArray(membersResponse)
        ? membersResponse.map((member) => ({
            id: member.userId,
            firstName: member.firstName,
            lastName: member.lastName,
            role: member.role,
          }))
        : [];

      setMembers(formattedMembers);

      // Fetch join requests for a specific stable
      const requestsResponse = await stableService.getStableRequests(stableId);
      setReceivedRequests(requestsResponse.received || []);

      // Fetch invites sent by the stable
      const invitesResponse = await stableService.getStableInvites(stableId);
      setSentInvites(Array.isArray(invitesResponse) ? invitesResponse : []);

      setError(null);
    } catch (error) {
      setError(error.message || "Failed to load stable data");
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  const rejectRequest = async (userId) => {
    setLoading(true);
    setOperationType("update");

    try {
      await stableService.rejectStableJoinRequest({
        userId: userId,
        stableId: stableId,
      });
      await fetchStableData();
      return true;
    } catch (error) {
      setError(error.message || "Failed to reject request");
      setLoading(false);
      return false;
    }
  };

  const cancelInvitation = async (userId) => {
    setLoading(true);
    setOperationType("update");

    try {
      await stableService.cancelStableInvite({
        userId: userId,
        stableId: stableId,
      });
      await fetchStableData();
      return true;
    } catch (error) {
      setError(error.message || "Failed to cancel invitation");
      setLoading(false);
      return false;
    }
  };

  const updateMemberRole = async (userId, newRole) => {
    setLoading(true);
    setOperationType("update");

    try {
      await userService.updateUserStableRole(userStableId, newRole);
      await fetchStableData();
      return true;
    } catch (error) {
      setError(error.message || "Failed to update member role");
      setLoading(false);
      return false;
    }
  };

  const approveRequest = async (userId) => {
    setLoading(true);
    setOperationType("update");

    try {
      const requestData = {
        userId: userId,
        stableId: stableId,
      };

      await stableService.acceptStableJoinRequest(requestData);
      await fetchStableData();
      return true;
    } catch (error) {
      console.error("Error accepting join request:", error);
      setError(error.message || "Failed to approve request");
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    fetchStableData();
  }, [fetchStableData]);

  return {
    // Data
    members,
    receivedRequests,
    sentInvites,

    // Status
    loading,
    error,
    loadingState,

    // Functions
    approveRequest,
    updateMemberRole,
    rejectRequest,
    cancelInvitation,
    refreshData: fetchStableData,
  };
};
