import { useState, useCallback, useEffect } from "react";
import userService from "../api/services/userService";
import { useAuth } from "../context/AuthContext";
import { useLoadingState } from "./useLoadingState";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../utils/errorUtils";
import { ROUTES } from "../routes/routeConstants";
import {authService} from "../api/index.js";

export const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const [operationType, setOperationType] = useState("fetch");
  const navigate = useNavigate();

  // If no userId is provided, use current user's ID from auth context
  const currentUserId = userId || user?.id;

  const extractUserData = (response) => {
    return response?.data || response?.value || response;
  };

  const fetchAndUpdateUserData = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      setOperationType("fetch");
      setError(null);

      const response = await userService.getById(currentUserId);
      const responseUserData = extractUserData(response);

      setUserData(responseUserData);
      return true;
    } catch (err) {
      setError(err.message || "Failed to fetch user data");
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const updateUserData = async (data) => {
    if (!currentUserId) {
      throw new Error("User ID is required");
    }

    try {
      setLoading(true);
      setOperationType("update");
      setError(null);

      const updateData = {
        id: currentUserId,
        firstName: data.firstName,
        lastName: data.lastName,
        // email: data.email,
        // phoneNumber: data.phoneNumber,
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

  const deleteAccount = async (userId) => {
    try {
      setLoading(true);
      setOperationType("delete");
      setError(null);

      await authService.logoutAndDeleteUser(userId);

      // Always navigate to login
      navigate(ROUTES.LOGIN, { replace: true });

      return true;
    } catch (error) {
      setError(
        getErrorMessage(error, {
          defaultMessage: "Kunde inte radera kontot. Försök igen senare.",
        })
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchAndUpdateUserData();
    }
  }, [fetchAndUpdateUserData, currentUserId]);

  const loadingState = useLoadingState(loading, operationType);

  return {
    userData,
    loading,
    error,
    loadingState,
    fetchAndUpdateUserData,
    updateUserData,
    deleteAccount,
  };
};

export default useUserData;
