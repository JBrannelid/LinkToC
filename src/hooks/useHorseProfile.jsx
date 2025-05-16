import { useState, useCallback, useEffect } from "react";
import { horseService } from "../api/index.js";
import { useLoadingState } from "./useLoadingState";

export const useHorseProfile = (horseId) => {
  const [horseProfile, setHorseProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");

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
    if (horseId) {
      fetchHorseProfile(horseId);
    }
  }, [horseId, fetchHorseProfile]);

  const loadingState = useLoadingState(loading, operationType);

  return {
    horse: horseProfile?.horse || null,
    horseProfile,
    loading,
    error,
    loadingState,
    fetchHorseProfile,
  };
};

export default useHorseProfile;
