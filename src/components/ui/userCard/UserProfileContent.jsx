import React from "react";
import Card from "../card/";
import UserHorsesTab from "./UserHorsesTab";

const UserProfileContent = ({ user, activeTab }) => {
  // render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoTabContent user={user} />;
      case "assignments":
        return <AssignmentsTabContent user={user} />;
      case "horses":
        return <UserHorsesTab userId={user.userId} />;
      default:
        return <InfoTabContent user={user} />;
    }
  };

  return <div className="py-2">{renderTabContent()}</div>;
};

// Info tab content
const InfoTabContent = ({ user }) => {
  const currentStatus = user?.currentStatus || "";

  return (
    <div className="space-y-4 px-5 sm:px-10 md:px-20">
      {/* Current status section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <h3 className="font-bold">Current status:</h3>
        <div className="bg-white p-3 rounded-lg w-full sm:w-auto flex-1">
          <p>{currentStatus || "No current status"}</p>
        </div>
      </div>

      {/* Bio section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="bg-white p-3 rounded-lg w-full sm:w-auto flex-1">
          <p>BIO</p>
        </div>
      </div>
    </div>
  );
};

// Assignments tab content
const AssignmentsTabContent = ({ user }) => {
  return <p className="text-center py-4">Display a list of icons</p>;
};

export default UserProfileContent;
