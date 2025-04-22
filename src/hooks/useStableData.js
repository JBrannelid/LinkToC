import { useState, useEffect, useCallback } from "react";
import stableService from "../api/services/stableService";

export function useStableData(stableId) {
  const [stables, setStables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to unvoid rerendering fetch data from DB
  const fetchAndUpdateStables = useCallback(async () => {
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

  return {
    stables,
    stableId,
    status: { loading, error },
    fetchAndUpdateStables,
    getStableById,
  };
}

export default useStableData;
