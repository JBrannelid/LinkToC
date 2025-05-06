import { useState, useEffect, useCallback } from "react";
import stableService from "../api/services/stableService";
import { useLoadingState } from "./useLoadingState";

export function useStableData(stableId) {
  const [stables, setStables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  // Use useCallback to unvoid rerendering fetch data from DB
  const fetchAndUpdateStables = useCallback(async () => {
    setOperationType("fetch");

    try {
      setLoading(true);
      setError(null);

      // Search with empty parameters to get all stables
      const response = await stableService.searchStables({
        searchTerm: "",
        page: 0,
        pageSize: 100,
      });

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

  return {
    stables,
    stableId,
    status: { loading, error },
    loadingState,
    fetchAndUpdateStables,
    getStableById,
  };
}

export default useStableData;
