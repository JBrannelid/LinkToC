import React, { useState } from "react";
import UserHorsesTab from "./UserHorsesTab";
import EditInformationModal from "../../layout/EditInformationModal";

const UserProfileContent = ({ user, userProfile, activeTab, forceRefresh }) => {
  const [editModal, setEditModal] = useState({
    isOpen: false,
    field: "",
    label: "",
    value: "",
    multiline: false,
  });

  // Get the complete user data from userProfile or user
  const userData = userProfile?.userStableRole?.user || user;
  const userId = userData?.userId || userData?.id;

  const openEditModal = (field, label, value, multiline = false) => {
    setEditModal({
      isOpen: true,
      field,
      label,
      value,
      multiline,
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      field: "",
      label: "",
      value: "",
      multiline: false,
    });
  };

  // Render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <InfoTabContent
            user={userData}
            userProfile={userProfile}
            openEditModal={openEditModal}
          />
        );
      case "horses":
        return <UserHorsesTab userId={userId} userProfile={userProfile} />;
      default:
        return (
          <InfoTabContent
            user={userData}
            userProfile={userProfile}
            openEditModal={openEditModal}
          />
        );
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

      {/* Edit Modal */}
      <EditInformationModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        fieldName={editModal.field}
        fieldLabel={editModal.label}
        initialValue={editModal.value}
        userId={userId}
        multiline={editModal.multiline}
        userData={userData}
        refreshUserData={forceRefresh} // Use the force refresh function from parent
      />
    </>
  );
};

// Info tab content with clickable fields
const InfoTabContent = ({ user, userProfile, openEditModal }) => {
  const bio = user?.description || "💬 No status update";
  const currentStatus =
    user?.coreInformation || "🤫 This user's keeping it mysterious...";

  return (
    <div className="space-y-4 px-10">
      {/* Current status section  */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold mr-2">Current: </h3>
        <div
          className="bg-primary-light p-4 rounded-lg shadow-lg w-full cursor-pointer hover:border hover:border-primary"
          onClick={() =>
            openEditModal("coreInformation", "Status", currentStatus)
          }
        >
          <p>{currentStatus}</p>
        </div>
      </div>

      {/* Bio section */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:border hover:border-primary"
        onClick={() => openEditModal("description", "Bio", bio, true)}
      >
        <p className="whitespace-pre-line">{bio}</p>
      </div>
    </div>
  );
};

export default UserProfileContent;
