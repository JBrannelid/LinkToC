import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useUserData } from "../hooks/useUserData";
import { useAppContext } from "../context/AppContext";
import UserProfileHeader from "../components/ui/userCard/UserProfileHeader";
import UserProfileTabs from "../components/ui/userCard/UserProfileTabs";
import UserProfileContent from "../components/ui/userCard/UserProfileContent";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const { currentStable } = useAppContext();

  const {
    userData,
    userProfile,
    loading,
    error,
    loadingState,
    fetchUserProfile,
  } = useUserData(userId);

  useEffect(() => {
    if (userId && currentStable?.id) {
      fetchUserProfile(userId, currentStable.id);
    }
  }, [userId, currentStable?.id, fetchUserProfile]);

  // Combine user data and profile data
  const userWithProfile = React.useMemo(() => {
    if (!userData) return null;

    let userProfileData = { ...userData };

    if (userProfile) {
      // Extract user role from profile
      if (userProfile.userStableRole) {
        userProfileData.role = userProfile.userStableRole.role;
      }

      // Add horses data if available
      if (userProfile.userHorseRoles) {
        userProfileData.horses = userProfile.userHorseRoles;
      }
    }

    return userProfileData;
  }, [userData, userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <span className="ml-2">{loadingState.getMessage()}</span>
      </div>
    );
  }

  if (error || !userWithProfile) {
    return (
      <div className="bg-white rounded-lg p-6 m-4 text-center">
        <h2 className="text-xl font-medium mb-2">User not found</h2>
        <p className="text-gray-600 mb-4">
          The user profile you are looking for could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 lg:p-0 overflow-y-auto">
      <UserProfileHeader user={userData} userProfile={userProfile} />
      <UserProfileTabs activeTab={activeTab} onChange={setActiveTab} />
      <UserProfileContent
        user={userData}
        userProfile={userProfile}
        activeTab={activeTab}
      />
    </div>
  );
};

export default UserProfilePage;
