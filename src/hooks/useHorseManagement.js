import { useState, useCallback, useEffect } from "react";
import { useAppContext } from "./useAppContext.js";
import { useLoadingState } from "./useLoadingState";
import { horseService } from "../api/index.js";
import { createHorseProfile } from "../utils/horseProfileUtils.js";

const emptyStablesCache = new Set();

export const useHorseManagement = (stableId) => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  const { stableRefreshKey } = useAppContext();

  const loadingState = useLoadingState(loading, operationType);

  const fetchHorses = useCallback(async () => {
    if (!stableId) return;

    if (emptyStablesCache.has(stableId)) {
      console.warn(
        `Stable ${stableId} is known to be empty - skipping API call`
      );
      setHorses([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOperationType("fetch");

    try {
      // Use the endpoint that returns complete horse data
      const horsesData = await horseService.getHorsesWithOwnersByStable(
        stableId
      );

      // Map to the expected format in the UI
      const processedHorses = Array.isArray(horsesData)
        ? horsesData.map((horse) => ({
            id: horse.horseId,
            stableHorseId: horse.id,
            name: horse.horseName,
            breed: horse.horseBreed,
            color: horse.horseColor,
            owner:
              horse.horseOwners && horse.horseOwners.length > 0
                ? {
                    firstName: horse.horseOwners[0],
                    lastName: "",
                  }
                : null,
          }))
        : [];

      if (Array.isArray(horsesData) && horsesData.length === 0) {
        emptyStablesCache.add(stableId);
      }

      setHorses(processedHorses);
      setError(null);
    } catch (error) {
      if (error.status === 404 || error.statusCode === 404) {
        const errorMessage = error.message || error.details?.message || "";
        if (errorMessage.includes("No horses")) {
          emptyStablesCache.add(stableId);

          setHorses([]);
          setError(null);
          setLoading(false);
          return;
        }
      }
      setError(error.message || "Failed to load horses");
    } finally {
      setLoading(false);
    }
  }, [stableId]);

  const addHorse = async (horseData, userId) => {
    emptyStablesCache.delete(stableId);
    setLoading(true);
    setOperationType("create");

    try {
      // Format the data according to HorseCompositionCreateDto
      const compositionData = {
        horse: {
          name: horseData.name,
          breed: horseData.breed || null,
          color: horseData.color || null,
          age: horseData.age || null,
        },
        stableId: stableId,
        userId: userId,
      };

      // Call the composition endpoint
      await horseService.createHorseComposition(compositionData);

      // Refresh the horses list
      await fetchHorses();

      return { success: true };
    } catch (error) {
      console.error("Error adding horse:", error);
      setError(error.message || "Failed to add horse");
      return { success: false, error: error };
    } finally {
      setLoading(false);
    }
  };

  const updateHorse = async (horseId, horseData) => {
    setLoading(true);
    setOperationType("update");

    try {
      // Format the horse data to match HorseUpdateDto
      const updateData = {
        id: horseId,
        name: horseData.name,
        breed: horseData.breed || null,
        color: horseData.color || null,
        age: horseData.age || null,
        coreInformation: horseData.coreInformation || null,
        description: horseData.description || null,
        currentBox: horseData.currentBox || null,
        weight: horseData.weight || null,
        height: horseData.height || null,
      };

      const response = await horseService.update(updateData);

      // Extract data from response
      const updatedHorseData = response?.data || response?.value || response;

      // Refresh the horses list
      await fetchHorses();
      return { success: true, data: updatedHorseData };
    } catch (error) {
      console.error("Error updating horse:", error);
      setError(error.message || "Failed to update horse");
      return { success: false, error: error };
    } finally {
      setLoading(false);
    }
  };

  const deleteHorse = async (horseId) => {
    setLoading(true);
    setOperationType("delete");

    try {
      const isLastHorse = horses.length === 1;

      const response = await horseService.delete(horseId);

      if (isLastHorse) {
        setHorses([]);
        setError(null);
        return { success: true, data: response };
      }
      // Refresh the horses list
      await fetchHorses();
      return { success: true, data: response };
    } catch (error) {
      console.error("Error deleting horse:", error);
      setError(error.message || "Failed to delete horse");
      return { success: false, error: error };
    } finally {
      setLoading(false);
    }
  };

  // Fetch horses on component mount or when stableId changes
  useEffect(() => {
    fetchHorses();
  }, [fetchHorses, stableRefreshKey]);

  return {
    // Data
    horses,
    stableId,

    // Status
    loading,
    error,
    loadingState,

    // Functions
    addHorse,
    updateHorse,
    deleteHorse,
    refreshData: fetchHorses,
  };
};

export const useHorseProfile = (horseId) => {
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  const loadingState = useLoadingState(loading, operationType);

  const getHorseData = useCallback(async () => {
    setOperationType("fetch");

    if (!horseId) {
      console.error("Horse ID is required");
      setError("Horse ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await horseService.getHorseProfile(horseId);

      // Extract horse data from response
      const rawHorseData =
        response?.data ||
        response?.value ||
        (typeof response === "object" && response !== null ? response : null);

      if (!rawHorseData) {
        console.error("Could not extract horse data from response");
        setError("Could not extract horse data from response");
        setLoading(false);
        return;
      }

      // Create the horse profile with all expected fields
      const processedHorse = createHorseProfile(rawHorseData);
      setHorse(processedHorse);
      setError(null);
    } catch (err) {
      console.error("Error fetching horse data:", err);
      setError(err.message || "Failed to load horse data");
    } finally {
      setLoading(false);
    }
  }, [horseId]);

  const updateHorse = async (updateData) => {
    setOperationType("update");

    if (!horseId || !updateData) {
      console.error("Horse ID or data is missing");
      return { success: false, message: "Horse ID or data is missing" };
    }

    try {
      setLoading(true);

      // Format the horse data to match HorseUpdateDto
      const formattedData = {
        id: horseId,
        name: updateData.name || horse?.name,
        breed: updateData.breed || horse?.breed,
        color: updateData.color || horse?.color,
        age: updateData.age || horse?.age,
        coreInformation: updateData.coreInformation || horse?.coreInformation,
        description: updateData.description || horse?.description,
        currentBox: updateData.currentBox || horse?.currentBox,
        weight: updateData.weight || horse?.weight,
        height: updateData.height || horse?.height,
        stableId: horse?.stableId,
      };

      const response = await horseService.update(formattedData);

      // Extract data from response
      const updatedHorseData = response?.data || response?.value || response;

      const processedHorse = createHorseProfile(updatedHorseData);
      setHorse(processedHorse);
      setError(null);
      return { success: true, data: processedHorse };
    } catch (err) {
      console.error("Error updating horse data:", err);
      setError(err.message || "Failed to update horse");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteHorse = async () => {
    setOperationType("delete");

    if (!horseId) {
      console.error("Horse ID is missing");
      return { success: false, error: "Horse ID is missing" };
    }

    try {
      setLoading(true);
      const response = await horseService.delete(horseId);
      setHorse(null);
      setError(null);
      return { success: true, data: response };
    } catch (err) {
      console.error("Error deleting horse data:", err);
      setError(err.message || "Failed to delete horse");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Fetch horse data on component mount or when horseId changes
  useEffect(() => {
    getHorseData();
  }, [getHorseData]);

  return {
    horse,
    horseId,
    loading,
    error,
    loadingState,
    getHorseData,
    updateHorse,
    deleteHorse,
  };
};
