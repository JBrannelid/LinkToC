import { useEffect, useState, useCallback } from "react";
import { stableHorseService } from "../api/index.js";
import { useLoadingState } from "./useLoadingState";

export function useStableHorses(stableId) {
  const [stableHorses, setStableHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [operationType, setOperationType] = useState("fetch");

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

  return { getStableHorses, stableHorses, loading, error, operationType };
}
export default useStableHorses;
