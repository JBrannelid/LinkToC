import React, { useState } from "react";
import { useParams } from "react-router";
import { useUserData } from "../hooks/useUserData";
import { useAppContext } from "../context/AppContext";
import { useStableManagement } from "../hooks/useStableManagement";
import UserProfileHeader from "../components/ui/userCard/UserProfileHeader";
import UserProfileTabs from "../components/ui/userCard/UserProfileTabs";
import UserProfileContent from "../components/ui/userCard/UserProfileContent";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const { currentStable } = useAppContext();
  const { userData, loading, error, loadingState } = useUserData(userId);
  const { members } = useStableManagement(currentStable?.id);

  // Find the user's role in the current stable
  const userWithRole = React.useMemo(() => {
    if (!userData || !members || members.length === 0) return userData;

    // Find this user in the members list to get their role
    const memberData = members.find(
      (member) => member.userId === Number(userId)
    );

    if (memberData) {
      // Return user data with role added
      return {
        ...userData,
        role: memberData.role,
      };
    }

    return userData;
  }, [userData, members, userId]);

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
      <UserProfileHeader user={userWithRole} />
      <UserProfileTabs activeTab={activeTab} onChange={setActiveTab} />
      <UserProfileContent user={userWithRole} activeTab={activeTab} />
    </div>
  );
};

export default UserProfilePage;
