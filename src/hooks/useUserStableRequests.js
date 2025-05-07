import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import stableService from "../api/services/stableService";
import { useLoadingState } from "./useLoadingState";

export const useUserStableRequests = () => {
  const [stableRequests, setStableRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");
  const { user } = useAuth();

  const loadingState = useLoadingState(loading, operationType);

  const fetchUserRequests = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setOperationType("fetch");

    try {
      const response = await stableService.getUserStableRequests(user.id);
      setStableRequests(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load your stable requests");
      setStableRequests([]);
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

      await fetchUserRequests();
      return true;
    } catch (err) {
      setError(err.message || "Failed to cancel request");
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, [fetchUserRequests]);

  return {
    stableRequests,
    loading,
    error,
    loadingState,
    cancelRequest,
    refreshData: fetchUserRequests,
  };
};

export default useUserStableRequests;
