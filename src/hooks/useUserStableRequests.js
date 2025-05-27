import { useState, useCallback, useEffect } from "react";
import { useLoadingState } from "./useLoadingState";
import stableService from "../api/services/stableService";
import { useAuth } from "../context/AuthContext";

export const useUserStableRequests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");
  const { user } = useAuth();

  const loadingState = useLoadingState(loading, operationType);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setOperationType("fetch");

    try {
      // Fetch requests sent by the user
      const response = await stableService.getUserStableRequests(user.id);
      setSentRequests(Array.isArray(response) ? response : []);
      setReceivedInvites([]); 

      setError(null);
    } catch (error) {
      setError(error.message || "Failed to load your stable requests");
      setSentRequests([]);
      setReceivedInvites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const cancelRequest = async (stableId) => {
    if (!user?.id || !stableId) {
      return false;
    }

    setLoading(true);
    setOperationType("update");

    try {
      await stableService.cancelStableJoinRequest({
        userId: user.id,
        stableId: stableId,
      });

      await fetchUserData();
      return true;
    } catch (error) {
      setError(error.message || "Failed to cancel request");
      setLoading(false);
      return false;
    }
  };

  const acceptInvite = async (stableId) => {
    if (!user?.id || !stableId) {
      return false;
    }

    setLoading(true);
    setOperationType("update");

    try {
      await stableService.acceptStableInvite({
        userId: user.id,
        stableId: stableId,
      });

      await fetchUserData();
      return true;
    } catch (error) {
      setError(error.message || "Failed to accept invite");
      setLoading(false);
      return false;
    }
  };

  const rejectInvite = async (stableId) => {
    if (!user?.id || !stableId) {
      return false;
    }

    setLoading(true);
    setOperationType("update");

    try {
      await stableService.refuseStableInvite({
        userId: user.id,
        stableId: stableId,
      });

      await fetchUserData();
      return true;
    } catch (error) {
      setError(error.message || "Failed to reject invite");
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    sentRequests,
    receivedInvites,
    loading,
    error,
    loadingState,
    cancelRequest,
    acceptInvite,
    rejectInvite,
    refreshData: fetchUserData,
  };
};

export default useUserStableRequests;
