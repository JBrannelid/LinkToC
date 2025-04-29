import { useState, useCallback, useEffect } from "react";
import userService from "../api/services/userService";
import { useAuth } from "../context/AuthContext";
import { useLoadingState } from "./useLoadingState";

export const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [operationType, setOperationType] = useState("fetch");

  // If no userId is provided, use current user's ID from auth context
  const currentUserId = userId || user?.id;

  const fetchAndUpdateUserData = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      setOperationType("fetch");
      setError(null);

      const response = await userService.getById(currentUserId);

      const responsUserData = response?.data || response?.value || response;

      setUserData(responsUserData);
      return true;
    } catch (err) {
      setError(err.message || "Failed to fetch user data");
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      fetchAndUpdateUserData();
    }
  }, [fetchAndUpdateUserData, currentUserId]);

  const updateUserData = async (data) => {
    try {
      setLoading(true);
      setOperationType("update");
      setError(null);

      const updateData = {
        id: currentUserId,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      const response = await userService.update(updateData);

      // Check if the update was successful and refresh data
      if (response && (response.isSuccess || response.statusCode === 200)) {
        await fetchAndUpdateUserData();
        return { success: true };
      } else {
        throw new Error(response?.message || "Uppdatering misslyckades");
      }
    } catch (err) {
      setError(err.message || "Uppdatering misslyckades");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loadingState = useLoadingState(loading, operationType);

  return {
    userData,
    loading,
    error,
    loadingState,
    fetchUserData: fetchAndUpdateUserData,
    updateUserData,
  };
};

export default useUserData;
