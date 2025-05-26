import { useState, useEffect, useCallback } from "react";
import { useLoadingState } from "./useLoadingState";
import horseService from "../api/services/horseService";

export const useStableHorses = (stableId) => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  const fetchHorses = useCallback(async () => {
    if (!stableId) {
      setHorses([]);
      setLoading(false);
      return false;
    }

    setLoading(true);
    setOperationType("fetch");

    try {
      const data = await horseService.getHorsesWithOwnersByStable(stableId);
      setHorses(data || []);
      setError(null);
      return true;
    } catch (error) {
      // Handle 404 as an empty result, not an error
      if (error.status === 404 || error.message?.includes("NOT FOUND_404")) {
        console.warn("No horses found for this stable - setting empty array");
        setHorses([]);
        setError(null);
      } else {
        console.error("Error fetching stable horses:", error);
        setError(error.message || "Failed to retrieve horses");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  // Load horses when the component mounts or stableId changes
  useEffect(() => {
    fetchHorses();
  }, [fetchHorses]);

  const loadingState = useLoadingState(loading, operationType);

  return {
    horses,
    loading,
    error,
    loadingState,
    refreshHorses: fetchHorses,
  };
};

export default useStableHorses;
