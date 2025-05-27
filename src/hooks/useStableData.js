import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "./useAppContext.js";
import { useAuth } from "./useAuth.js";
import { useLoadingState } from "./useLoadingState";
import axiosInstance from "../api/config/axiosConfig.js";
import { ENDPOINTS} from "../api/index.js";
import stableService from "../api/services/stableService";
import {getErrorMessage} from "../utils/errorUtils.js";

export function useStableData(stableId) {
  const [stables, setStables] = useState([]);
  const [currentStableData, setCurrentStableData] = useState(null);
  const [stableInfo, setStableInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");
  const { stableRefreshKey } = useAppContext();
  const {user} = useAuth();

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
  const deleteStable = useCallback(async (id) => {
    if (!id) {
      setError("Stable ID is required for deletion");
      return false;
    }

    setOperationType("delete");
    try {
      setLoading(true);
      setError(null);

      // Direct API call using axios instead of going through stableService
      await axiosInstance.delete(`${ENDPOINTS.STABLE}/delete/${id}`);

      // Refresh data after successful deletion
      if (stableId && stableId === id) {
        // If we're viewing the specific stable that was just deleted
        setCurrentStableData(null);
      } else {
        // Refresh the list of stables
        await fetchAndUpdateStables();
      }

      return true;
    } catch (error) {
      console.error("Stable deletion failed:", error);

      setError(
          getErrorMessage(error, {
            defaultMessage: "Failed to delete stable. Please try again.",
            customMessages: {
              "403": "You don't have permission to delete this stable.",
              "404": "Stable not found."
            }
          })
      );

      return false;
    } finally {
      setLoading(false);
    }
  }, [stableId, fetchAndUpdateStables]);

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
  const leaveStable = useCallback(async (stableIdToLeave) => {
    if (!stableIdToLeave) {
      setError("Stable ID is required");
      return false;
    }

    if (!user?.id) {
      setError("User ID is required");
      return false;
    }

    setOperationType("leave");
    try {
      setLoading(true);
      setError(null);
      
      await axiosInstance.delete(`/api/user-stables/leave/${user.id}/${stableIdToLeave}`);
      
      await fetchAndUpdateStables();

      return true;
    } catch (error) {
      console.error("Failed to leave stable:", error);

      setError(
          getErrorMessage(error, {
            defaultMessage: "Failed to leave stable. Please try again.",
            customMessages: {
              "403": "You don't have permission to leave this stable.",
              "404": "Stable or user not found."
            }
          })
      );

      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchAndUpdateStables]);

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
    deleteStable,
    leaveStable,
  };
}

export default useStableData;
