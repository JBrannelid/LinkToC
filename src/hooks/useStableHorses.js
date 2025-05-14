import { useState, useEffect, useCallback } from "react";
import horseService from "../api/services/horseService";
import { useLoadingState } from "./useLoadingState";

export const useStableHorses = (stableId) => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  const fetchHorsesWithOwners = useCallback(async () => {
    if (!stableId) {
      setHorses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOperationType("fetch");

    try {
      const data = await horseService.getHorsesWithOwnersByStable(stableId);
      setHorses(data);
      setError(null);
    } catch (error) {
      setHorses([]);
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  useEffect(() => {
    fetchHorsesWithOwners();
  }, [fetchHorsesWithOwners]);

  const loadingState = useLoadingState(loading, operationType);

  return {
    horses,
    loading,
    error,
    loadingState,
    refreshHorses: fetchHorsesWithOwners,
  };
};
