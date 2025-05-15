import { useState, useCallback, useEffect } from "react";
import { horseService } from "../api/index.js";
import { useLoadingState } from "./useLoadingState";

export const useHorseProfile = (horseId) => {
  const [horse, setHorse] = useState(null);
  const [horseProfile, setHorseProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

  const fetchHorseData = useCallback(async () => {
    if (!horseId) return;

    try {
      setLoading(true);
      setOperationType("fetch");
      setError(null);

      const response = await horseService.getById(horseId);

      // Extract horse data from response
      let horseData = null;
      if (response?.data) {
        horseData = response.data;
      } else if (response?.value) {
        horseData = response.value;
      } else if (response?.isSuccess && response?.value) {
        horseData = response.value;
      } else if (typeof response === "object" && response !== null) {
        horseData = response;
      }

      setHorse(horseData);
      return true;
    } catch (err) {
      setError(err.message || "Failed to fetch horse data");
      return false;
    } finally {
      setLoading(false);
    }
  }, [horseId]);

  const fetchHorseProfile = useCallback(async (horseId) => {
    if (!horseId) {
      setError("Horse ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setOperationType("fetch");
    setError(null);

    try {
      const response = await horseService.getHorseProfile(horseId);

      if (response && (response.isSuccess || response.statusCode === 200)) {
        setHorseProfile(response.value);
      } else {
        setError(response?.message || "Failed to fetch horse profile");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch horse profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHorseData();
  }, [fetchHorseData]);

  const loadingState = useLoadingState(loading, operationType);

  return {
    horse,
    horseProfile,
    loading,
    error,
    loadingState,
    fetchHorseData,
    fetchHorseProfile,
  };
};

export default useHorseProfile;
