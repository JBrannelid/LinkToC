import React from "react";
import UserHorsesTab from "./UserHorsesTab";

const UserProfileContent = ({ user, activeTab }) => {
  // Render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoTabContent user={user} />;
      case "horses":
        return <UserHorsesTab userId={user.userId} />;
      default:
        return <InfoTabContent user={user} />;
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
const InfoTabContent = ({ user }) => {
  const currentStatus = user?.currentStatus;
  const bio = user?.bio;

  return (
    <div className="space-y-4 px-10">
      {/* Current status section  */}
      <div className="bg-primary-light p-4 rounded-lg shadow-lg max-w-xs lg:max-w-full border border-primary">
        <div className="flex">
          <strong className="font-semibold mr-2">Current: </strong>
          <p>{currentStatus}</p>
        </div>
      </div>

      {/* Bio section */}
      <div className="bg-white p-6 rounded-lg border border-primary shadow-lg ">
        <p className="whitespace-pre-line">{bio || "lorem"}</p>
      </div>
    </div>
  );
};

export default UserProfileContent;
