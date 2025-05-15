import { useState, useEffect, useCallback } from "react";
import horseService from "../api/services/horseService";
import { useLoadingState } from "./useLoadingState";

import { stableHorseService } from "../api/index.js";

export const useStableHorses = (stableId) => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");
  const [stableHorses, setStableHorses] = useState([]);

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

  const getStableHorses = useCallback(async () => {
    setOperationType("fetch");
    if (!stableId) {
      console.error("Stable ID is required");
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await stableHorseService.getStableHorsesbyStableId(
        stableId
      );
      if (response?.value) {
        setStableHorses(response.value);
      }
      return true;
    } catch (error) {
      console.error("Error fetching stable horses:", error);
      setError(error.message || "Failed to retrieve stable horses");
      return false;
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  useEffect(() => {
    if (stableId) {
      getStableHorses();
    }
  }, [getStableHorses, stableId]);

  const loadingState = useLoadingState(loading, operationType);

  return {
    horses,
    loading,
    error,
    loadingState,
    refreshHorses: fetchHorsesWithOwners,
    getStableHorses,
    stableHorses,
    loading,
    error,
    operationType,
  };
};

export default useStableHorses;
