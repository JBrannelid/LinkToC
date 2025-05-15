import React from "react";
import UserHorsesTab from "./UserHorsesTab";

const UserProfileContent = ({ user, userProfile, activeTab }) => {
  // Render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoTabContent user={user} userProfile={userProfile} />;
      case "horses":
        return (
          <UserHorsesTab
            userId={user.userId || user.id}
            userProfile={userProfile}
          />
        );
      default:
        return <InfoTabContent user={user} userProfile={userProfile} />;
    }
  };

  return (
    <>
      {/* Desktop content */}
      <div className="hidden lg:block lg:px-40 xl:px-60 py-4">
        {renderTabContent()}
      </div>

      {/* Mobile  */}
      <div className="py-2 lg:hidden">{renderTabContent()}</div>
    </>
  );
};

// Info tab content
const InfoTabContent = ({ user, userProfile }) => {
  const userStableRole = userProfile?.userStableRole;
  const bio =
    user?.description ||
    userStableRole?.user?.description ||
    "No bio available";
  const currentStatus =
    user?.coreInformation ||
    userStableRole?.user?.coreInformation ||
    "No status available";

  return (
    <div className="space-y-4 px-10">
      {/* Current status section  */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold mr-2">Current: </h3>
        <div className="bg-white p-4 rounded-lg shadow-lg w-full h-10">
          <p>{currentStatus}</p>
        </div>
      </div>

      {/* Bio section */}
      <div className="bg-white p-6 rounded-lg  shadow-lg ">
        <p className="whitespace-pre-line">{bio}</p>
      </div>
    </div>
  );
};

export default UserProfileContent;
