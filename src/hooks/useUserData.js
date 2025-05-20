import { useState, useCallback, useEffect } from "react";
import userService from "../api/services/userService";
import { useAuth } from "../context/AuthContext";
import { useLoadingState } from "./useLoadingState";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../utils/errorUtils";
import { ROUTES } from "../routes/index.jsx";
import { authService } from "../api/index.js";
import { useAppContext } from "../context/AppContext";

export const useUserData = (userId, includeProfile = true) => {
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { currentStable } = useAppContext();
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

      // Ensure consistent naming of profile image fields
      if (responseUserData.profilePicture) {
        responseUserData.profileImage = responseUserData.profilePicture;
        responseUserData.profilePictureUrl = responseUserData.profilePicture;
      }

      console.log(
        "Updated user data with profile picture:",
        responseUserData.profilePicture
      );
      setUserData(responseUserData);
      return true;
    } catch (err) {
      setError(err.message || "Failed to fetch user data");
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchUserProfile = useCallback(async (userId, stableId) => {
    if (!userId || !stableId) {
      setError("User ID and Stable ID are required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setOperationType("fetch");
    setError(null);

    try {
      const response = await userService.getUserProfile(userId, stableId);

      if (response && (response.isSuccess || response.statusCode === 200)) {
        const profileData = response.value;

        setUserData(profileData.userStableRole.user);

        setUserProfile(profileData);
      } else {
        setError(response?.message || "Failed to fetch user profile");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserData = async (data) => {
    if (!currentUserId) {
      throw new Error("User ID is required");
    }

    try {
      setLoading(true);
      setOperationType("update");
      setError(null);

      // This is the problem - you're not including all required fields
      const updateData = {
        id: parseInt(currentUserId, 10), // Convert to integer
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email, // This is required but missing!
        phoneNumber: data.phoneNumber || null,
        emergencyContact: data.emergencyContact || null,
        coreInformation: data.coreInformation || null,
        description: data.description || null,
      };

      const response = await userService.update(updateData);

      // Check if the update was successful and refresh data
      if (response && (response.isSuccess || response.statusCode === 200)) {
        await fetchAndUpdateUserData();
        return { success: true };
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (err) {
      setError(err.message || "Update failed");
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
          defaultMessage: "Couldn't delete account. Please try again later.",
        })
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId && currentStable?.id && includeProfile) {
      fetchUserProfile(currentUserId, currentStable.id);
    } else if (currentUserId && !includeProfile) {
      fetchAndUpdateUserData();
    }
  }, [
    fetchUserProfile,
    fetchAndUpdateUserData,
    currentUserId,
    includeProfile,
    currentStable?.id,
  ]);

  const loadingState = useLoadingState(loading, operationType);

  return {
    userData,
    userProfile,
    loading,
    error,
    loadingState,
    fetchAndUpdateUserData,
    fetchUserProfile,
    updateUserData,
    deleteAccount,
  };
};

export default useUserData;
