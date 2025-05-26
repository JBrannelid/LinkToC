import React, { useState } from "react";
import HorseOwnersTab from "./HorseOwnersTab";
import { useAuth } from "../../../context/AuthContext";
import EditInformationModal from "../../layout/EditInformationModal";

const HorseProfileContent = ({
  horse,
  horseProfile,
  activeTab,
  forceRefresh,
}) => {
  const { user: currentUser } = useAuth();
  const [editModal, setEditModal] = useState({
    isOpen: false,
    field: "",
    label: "",
    value: "",
    multiline: false,
  });

  // Get the complete horse data from horseProfile or horse
  const enhancedHorse = horseProfile?.horse || horse;
  const horseId = enhancedHorse?.id;
  const hasHorseRole = horseProfile?.userHorseRoles?.some(
    (role) => String(role.user?.id) === String(currentUser?.id)
  );

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
            horse={enhancedHorse}
            horseProfile={horseProfile}
            openEditModal={openEditModal}
            hasHorseRole={hasHorseRole}
          />
        );
      case "owners":
        return <HorseOwnersTab horseId={horseId} horseProfile={horseProfile} />;
      default:
        return (
          <InfoTabContent
            horse={enhancedHorse}
            horseProfile={horseProfile}
            openEditModal={openEditModal}
            hasHorseRole={hasHorseRole}
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
        userId={horseId}
        multiline={editModal.multiline}
        userData={enhancedHorse} // Use the horse data object
        refreshUserData={forceRefresh} // Use the force refresh function from parent
        isHorse={true} // Flag to indicate we're editing a horse
        isCurrentUser={hasHorseRole}
      />
    </>
  );
};

// Info tab content
const InfoTabContent = ({ horse, openEditModal, hasHorseRole }) => {
  const coreInformation =
    horse?.coreInformation || "No important information added yet";

  const bio =
    horse?.bio ||
    horse?.description ||
    horse?.about ||
    "Time to write your legend! ✍️";

  return (
    <div className="space-y-4 px-10">
      {/* Details section */}
      <div className="flex flex-col space-y-2">
        <div>
          <h3 className="font-normal mr-2 text-start text-xl">Important </h3>
        </div>

        <div
          className="bg-primary-light p-4 rounded-lg shadow-lg w-full cursor-pointer hover:border hover:border-primary"
          onClick={
            hasHorseRole
              ? () =>
                  openEditModal("core info", "Important info", coreInformation)
              : undefined
          }
        >
          <p className="font-semibold">{coreInformation}</p>
        </div>
      </div>

      {/* Bio section */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:border hover:border-primary"
        onClick={
          hasHorseRole
            ? () => openEditModal("description", "About Horse", bio, true)
            : undefined
        }
      >
        {/* pre-line format the bio text */}
        <p className="whitespace-pre-line">{bio}</p>
      </div>
    </div>
  );
};

export default HorseProfileContent;
