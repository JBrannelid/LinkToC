import { useState, useEffect, useCallback } from "react";
import stableService from "../api/services/stableService";
import { useLoadingState } from "./useLoadingState";

export function useStableData(stableId) {
  const [stables, setStables] = useState([]);
  const [stableInfo, setStableInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  // Use useCallback to unvoid rerendering fetch data from DB
  const fetchAndUpdateStables = useCallback(async () => {
    setOperationType("fetch");

    try {
      setLoading(true);
      setError(null);

      // Get all stables
      const response = await stableService.getAll();
      const stableList = Array.isArray(response) ? response : [];
      setStables(stableList);

      return true;
    } catch (error) {
      setError(error.message || "Failed to retrieve stable data");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndUpdateStables();
  }, [fetchAndUpdateStables]);

  // Use useCallback to unvoid rerendering fetch data from DB
  const getStableById = useCallback(
    (id) => {
      return stables.find((stable) => stable.id === id) || null;
    },
    [stables]
  );

  const loadingState = useLoadingState(loading, operationType);

  // To only fetch stable with the corresponding ID, not all stables!
  const getById = useCallback(async () => {
    setOperationType("fetch");
    try {
      setLoading(true);
      setError(false);
      const fetchStableInfo = await stableService.getById(stableId);
      setStableInfo(fetchStableInfo.value);
      return true;
    } catch (error) {
      setError(error);
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  return {
    stables,
    stableId,
    status: { loading, error },
    loadingState,
    fetchAndUpdateStables,
    getStableById,
    getById,
    stableInfo,
  };
}

export default useStableData;
