import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import UserProfileContent from "../components/ui/userCard/UserProfileContent";
import UserProfileHeader from "../components/ui/userCard/UserProfileHeader";
import UserProfileTabs from "../components/ui/userCard/UserProfileTabs";
import { useAppContext } from "../hooks/useAppContext.js";
import { useUserData } from "../hooks/useUserData";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const { currentStable } = useAppContext();
  const [refreshCounter, setRefreshCounter] = useState(0); // Add counter for forced refreshes

  const {
    userData,
    userProfile,
    loading,
    error,
    loadingState,
    fetchUserProfile,
  } = useUserData(userId);

  // Refreshes API data and updates local state
  const forceRefresh = useCallback(async () => {
    if (userId && currentStable?.id) {
      try {
        await fetchUserProfile(userId, currentStable.id);
        // Force component re-render by incrementing counter
        setRefreshCounter((prev) => prev + 1);
      } catch (error) {
        console.error("Error refreshing profile:", error);
      }
    }
  }, [userId, currentStable?.id, fetchUserProfile]);

  useEffect(() => {
    if (userId && currentStable?.id) {
      fetchUserProfile(userId, currentStable.id);
    }
  }, [userId, currentStable?.id, fetchUserProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <span className="ml-2">{loadingState.getMessage()}</span>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-white rounded-lg p-6 m-4 text-center">
        <h2 className="text-xl font-medium mb-2">User not found</h2>
        <p className="text-gray-600 mb-4">
          Poof! That user just pulled a disappearing act 🧙‍♂️
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-35 lg:p-0 overflow-y-auto">
      <UserProfileHeader
        key={`header-${refreshCounter}`}
        user={userData}
        userProfile={userProfile}
        forceRefresh={forceRefresh} // Pass the refresh function to the header
      />
      <UserProfileTabs activeTab={activeTab} onChange={setActiveTab} />
      <UserProfileContent
        key={`content-${refreshCounter}`}
        user={userData}
        userProfile={userProfile}
        activeTab={activeTab}
        forceRefresh={forceRefresh}
      />
    </div>
  );
};

export default UserProfilePage;
