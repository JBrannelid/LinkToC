import React, { useState } from "react";
import { useParams } from "react-router";
import { useUserData } from "../hooks/useUserData";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import UserProfileHeader from "../components/ui/userCard/UserProfileHeader";
import UserProfileTabs from "../components/ui/userCard/UserProfileTabs";
import UserProfileContent from "../components/ui/userCard/UserProfileContent";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("info");

  const { userData, loading, error, loadingState } = useUserData(userId);

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
          The user profile you are looking for could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 lg:p-0 overflow-y-auto">
      <UserProfileHeader user={userData} />
      <UserProfileTabs activeTab={activeTab} onChange={setActiveTab} />
      <UserProfileContent user={userData} activeTab={activeTab} />
    </div>
  );
};

export default UserProfilePage;
