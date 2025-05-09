import { useCallback, useEffect, useState } from "react";
import { createHorseProfile } from "../utils/horseProfileUtils.js";
import { horseService } from "../api/index.js";
import { useLoadingState } from "./useLoadingState";

/**
 * Hook for managing a single horse profile
 * @returns {Object}
 * @param horseId
 */
export const useHorseProfile = (horseId) => {
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [operationType, setOperationType] = useState("fetch");

  const getHorseData = useCallback(async () => {
    setOperationType("fetch");

    if (!horseId) {
      console.error("Horse ID is required");
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await horseService.getById(horseId);
      console.log("API Response:", response);

      // Extract horse data from response
      let rawHorseData = null;

      // Handle API response structure
      if (response?.data) {
        rawHorseData = response.data;
      } else if (response?.value) {
        rawHorseData = response.value;
      } else if (response?.isSuccess && response?.value) {
        rawHorseData = response.value;
      } else if (typeof response === "object" && response !== null) {
        rawHorseData = response;
      }

      console.log("Extracted raw horse data:", rawHorseData);

      if (!rawHorseData) {
        console.error("Could not extract horse data from response");
        setError(true);
        setLoading(false);
        return;
      }

      // Create the horse profile with all expected fields
      const processedHorse = createHorseProfile(rawHorseData);
      console.log("Processed horse with default fields:", processedHorse);

      setHorse(processedHorse);
      setError(false);
    } catch (err) {
      console.error("Error fetching horse data:", err);
      setLoading(false);
      setError(true);
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
      const response = await horseService.update(horseId, updateData);

      // Extract data from response
      let rawHorseData = null;
      if (response?.data) {
        rawHorseData = response.data;
      } else if (response?.value) {
        rawHorseData = response.value;
      } else if (response?.isSuccess && response?.value) {
        rawHorseData = response.value;
      } else {
        rawHorseData = response;
      }

      const processedHorse = createHorseProfile(rawHorseData);
      setHorse(processedHorse);
      setError(false);
      return { success: true, data: rawHorseData };
    } catch (err) {
      console.error("Error updating horse data:", err);
      setError(true);
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
      setError(false);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error deleting horse data:", err);
      setError(true);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHorseData();
  }, [getHorseData]);

  // Standardized loading state with message
  const loadingState = useLoadingState(loading, operationType);

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

/**
 * Hook for managing multiple horses
 * @returns {Object}
 */
export const useHorseManagement = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAllHorses = useCallback(async () => {
    setOperationType("fetch");

    try {
      setLoading(true);
      const response = await horseService.getAll();

      // Extract data from response
      let horsesData = [];
      if (response?.data) {
        horsesData = response.data;
      } else if (response?.value) {
        horsesData = response.value;
      } else if (response?.isSuccess && response?.value) {
        horsesData = response.value;
      } else {
        horsesData = response;
      }

      const processedHorses = Array.isArray(horsesData)
        ? horsesData.map((horse) => createHorseProfile(horse))
        : [];

      setHorses(processedHorses);
      setError(false);
    } catch (err) {
      console.error("Error fetching all horses:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const createHorse = async (horseData) => {
    setOperationType("create");

    if (!horseData) {
      console.error("Horse data is missing");
      return { success: false, error: "Horse data is missing" };
    }
    try {
      setLoading(true);
      const response = await horseService.create(horseData);

      // Extract data from response
      let newHorseData;
      if (response?.data) {
        newHorseData = response.data;
      } else if (response?.value) {
        newHorseData = response.value;
      } else if (response?.isSuccess && response?.value) {
        newHorseData = response.value;
      } else {
        newHorseData = response;
      }

      const processedHorse = createHorseProfile(newHorseData);
      setHorses((prevHorses) => [...prevHorses, processedHorse]);
      return { success: true, data: newHorseData };
    } catch (err) {
      console.error("Error creating horse:", err);
      setError(true);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHorses();
  }, [fetchAllHorses]);

  return { horses, loading, error, fetchAllHorses, createHorse };
};
