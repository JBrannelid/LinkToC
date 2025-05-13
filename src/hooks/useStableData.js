import { useState, useEffect, useCallback } from "react";
import stableService from "../api/services/stableService";
import { useLoadingState } from "./useLoadingState";
import { useAppContext } from "../context/AppContext";

export function useStableData(stableId) {
  const [stables, setStables] = useState([]);
  const [currentStableData, setCurrentStableData] = useState(null);
  const [stableInfo, setStableInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");
  const { stableRefreshKey } = useAppContext();

  // Fetch single stable by ID
  const fetchStableById = useCallback(async () => {
    if (!stableId) {
      setLoading(false);
      return;
    }

    setOperationType("fetch");
    try {
      setLoading(true);
      setError(null);

      const response = await stableService.getById(stableId);
      if (response?.value) {
        setCurrentStableData(response.value);
      }

      return true;
    } catch (error) {
      setError(error.message || "Failed to retrieve stable data");
      return false;
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  // Use useCallback to unvoid rerendering fetch data from DB
  const fetchAndUpdateStables = useCallback(async () => {
    setOperationType("fetch");

    try {
      setLoading(true);
      setError(null);

      // Search with empty parameters to get all stables
      const response = await stableService.search({
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
    if (stableId) {
      // Fetch single stable when stableId is provided
      fetchStableById();
    } else {
      // Fetch all stables when no stableId is provided
      fetchAndUpdateStables();
    }
  }, [fetchAndUpdateStables, fetchStableById, stableId, stableRefreshKey]);

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
    currentStableData,
    stableId,
    status: { loading, error },
    loadingState,
    fetchAndUpdateStables,
    getStableById,
    fetchStableById,
    getById,
    stableInfo,
  };
}

export default useStableData;
