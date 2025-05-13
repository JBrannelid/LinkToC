import React from "react";
import Card from "../card/";

const UserProfileContent = ({ user, activeTab }) => {
  // render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoTabContent user={user} />;
      case "assignments":
        return <AssignmentsTabContent user={user} />;
      case "horses":
        return <HorsesTabContent user={user} />;
      default:
        return <InfoTabContent user={user} />;
    }
  };

  return <div className="px-4 py-4">{renderTabContent()}</div>;
};

// Info tab content
const InfoTabContent = ({ user }) => {
  const currentStatus = user?.currentStatus || "";

  return (
    <div className="space-y-4">
      {/* Current status section */}
      <div className="flex flex-row">
        <h3 className="font-bold mb-2 mr-3 mt-2 w-6/10">Current status:</h3>
        <div className="bg-white p-3 rounded-lg w-full">
          <p>{currentStatus || "No current status"}</p>
        </div>
      </div>

      {/* Bio section */}
      <Card.Container>
        <Card.Body>
          <p className="whitespace-pre-line">
            {user?.bio || "No bio information available."}
          </p>
        </Card.Body>
      </Card.Container>
    </div>
  );
};

// Assignments tab content
const AssignmentsTabContent = ({ user }) => {
  return <p className="text-center  py-4">Display a list of icons</p>;
};

// Horses tab content
const HorsesTabContent = ({ user }) => {
  return (
    <Card.Container>
      <Card.Body>
        <p className="text-center text-gray py-4">No horses available</p>
      </Card.Body>
    </Card.Container>
  );
};

export default UserProfileContent;
