import React, { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import {
  formatUserFullName,
  getProfileImageUrl,
  getRoleName,
} from "../../../utils/userUtils";
import Button from "../../ui/Button";
import MessageIcon from "../../../assets/icons/MessageIcon";
import EmergencyContactIcon from "../../../assets/icons/EmergencyContactIcon";
import PhoneIcon from "../../../assets/icons/PhoneIcon";
import PenIcon from "../../../assets/icons/PenIcon";
import EditInformationModal from "../../layout/EditInformationModal";
import { useAuth } from "../../../context/AuthContext";
import ProfileImage from "../../../components/common/ProfileImage";

const UserProfileHeader = ({ user, userProfile, forceRefresh }) => {
  const { currentStable } = useAppContext();
  const { user: currentUser } = useAuth();
  const [editModal, setEditModal] = useState({
    isOpen: false,
    field: "",
    label: "",
    value: "",
    multiline: false,
  });

  // Combine data from user and userProfile
  const userStableRole = userProfile?.userStableRole;
  const enhancedUser = userStableRole?.user || user;
  const userFullName = formatUserFullName(enhancedUser);
  const profileImageUrl = getProfileImageUrl(enhancedUser);
  const hasCustomProfileImage = !!enhancedUser?.profileImageUrl;

  // Permissions check for editing user data
  const isCurrentUser = String(currentUser.id) === String(enhancedUser.id);

  // Get role from userProfile if available
  const userRole = userStableRole
    ? userStableRole.role
    : user.stableRoles
    ? user.stableRoles[currentStable?.id]
    : user.role;

  const roleName = getRoleName(userRole);

  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const emergencyContact = enhancedUser?.emergencyContact;

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

  return (
    <>
      {/* Desktop header  */}
      <div className="hidden lg:block lg:px-40 xl:px-60 pt-8">
        <div className="flex justify-between items-start ">
          {/* User info */}
          <div className="flex flex-col relative group">
            <h1 className="text-3xl font-heading font-semibold">
              {userFullName}
            </h1>
            <p className="text-sm text-gray">
              <span>{roleName || "Member"}</span>
            </p>
          </div>

          {/* Contact buttons */}
          <div className="flex flex-row gap-2 mr-5 mt-10">
            {enhancedUser.phoneNumber && (
              <div className="relative group">
                <Button
                  type="secondary"
                  className="rounded-lg !border-primary flex flex-col max-h-20 min-h-19 min-w-25"
                  aria-label="Phone"
                >
                  <PhoneIcon className="text-primary mb-1" size={20} />
                  <span className="mt-1 mb-1 text-primary font-medium">
                    {enhancedUser.phoneNumber}
                  </span>
                </Button>

                {/* Permission controll */}
                {isCurrentUser && (
                  <button
                    className="absolute -right-2 -top-2 transition-opacity bg-primary-light rounded-full p-1"
                    onClick={() =>
                      openEditModal(
                        "phoneNumber",
                        "Phone Number",
                        enhancedUser.phoneNumber || ""
                      )
                    }
                  >
                    <PenIcon className="w-5 h-5 text-primary" />
                  </button>
                )}
              </div>
            )}

            {/* Emergency contact */}
            <div className="relative group">
              <Button
                type="secondary"
                className="rounded-lg !border-primary flex flex-col max-h-20 min-h-19 min-w-25"
                aria-label="Emergency contact"
              >
                <EmergencyContactIcon className="text-primary mb-1" size={20} />
                <span className="mt-1 mb-1 text-primary font-medium">
                  {emergencyContact}
                </span>
              </Button>
              {/* Permission controll */}
              {isCurrentUser && (
                <button
                  className="absolute -right-2 -top-2 transition-opacity bg-primary-light rounded-full p-1"
                  onClick={() =>
                    openEditModal(
                      "emergencyContact",
                      "Emergency Contact",
                      enhancedUser.emergencyContact || ""
                    )
                  }
                >
                  <PenIcon className="w-5 h-5 text-primary" />
                </button>
              )}
            </div>

            {/* Messenger */}
            <Button
              type="secondary"
              className="rounded-lg !border-primary flex flex-col opacity-40 max-h-20 min-h-19 min-w-25"
              aria-label="Messenger"
            >
              <MessageIcon className="text-primary mb-1" size={20} />
              <span className="text-xs">Messenger</span>
            </Button>
          </div>
        </div>

        {/* Image carousel */}
        <div className="relative mt-4 border-2 border-primary rounded-lg overflow-hidden flex justify-center bg-gradient-to-b from-primary-light to-white">
          <div className="w-60 h-60 relative overflow-hidden">
            <ProfileImage
              user={enhancedUser}
              className="w-full h-full object-cover scale-100 object-center"
              size="rounded"
              alt={`Profile of ${userFullName}`}
            />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden relative">
        {/* User image with fixed height and rounded corners */}
        <div className="relative overflow-hidden mt-2">
          <div className="w-full h-90 sm:h-120 md:h-150 bg-gradient-to-b from-primary-light to-white">
            <ProfileImage
              user={enhancedUser}
              className="w-full h-full object-cover object-[center_25%]"
              size="small"
              alt={`Profile of ${userFullName}`}
            />
          </div>
        </div>

        {/* User info */}
        <div className="px-4 sm:px-6 md:px-8 py-6 bg-background rounded-t-3xl -mt-8 relative z-10 border-light border-t-2">
          <div className="flex flex-col gap-1 relative group ">
            <h1 className="text-3xl font-heading font-semibold pr-8 ">
              {userFullName}
            </h1>
            {/* RoleName */}
            <p className="text-sm text-gray">
              <span>{roleName || "Unknown user role"}</span>
            </p>
          </div>
          <div className="flex justify-start gap-2 mt-6 md:justify-center md:px-20">
            {/* Contact buttons remain the same */}
            <div className="flex flex-col items-center w-full md:w-9/10 relative group">
              {/* PhoneNumber - show number if pressed */}
              <Button
                type="secondary"
                className="w-full h-13 md:h-12 !bg-primary-light !border-primary rounded-xl"
                aria-label="Phone"
                onClick={() => setShowPhoneNumber(!showPhoneNumber)}
              >
                {showPhoneNumber ? (
                  <span className="text-sm text-primary font-medium">
                    {enhancedUser.phoneNumber}
                  </span>
                ) : (
                  <PhoneIcon className="text-primary" size={30} />
                )}
              </Button>
              <span className="mt-1 text-xs text-center text-primary">
                Number
              </span>
              {/* Permission control */}
              {isCurrentUser && (
                <button
                  className="absolute -right-1 -top-1 transition-opacity bg-white rounded-full p-1"
                  onClick={() =>
                    openEditModal(
                      "phoneNumber",
                      "Phone Number",
                      enhancedUser.phoneNumber || ""
                    )
                  }
                >
                  <PenIcon className="w-5 h-5 text-primary" />
                </button>
              )}
            </div>

            {/* Emergency button */}
            <div className="flex flex-col items-center w-full md:w-9/10 relative group">
              <Button
                type="secondary"
                className={`w-full h-13 md:h-12 !bg-primary-light !border-primary rounded-xl ${
                  !emergencyContact ? "opacity-40" : ""
                }`}
                aria-label="Emergency contact"
                onClick={() => setShowEmergencyContact(!showEmergencyContact)}
                disabled={!emergencyContact}
              >
                {showEmergencyContact && emergencyContact ? (
                  <span className="text-sm text-primary font-medium">
                    {emergencyContact}
                  </span>
                ) : (
                  <EmergencyContactIcon className="text-primary" size={30} />
                )}
              </Button>
              <span className="mt-1 text-xs text-center text-primary">
                Emergency contact
              </span>
              {/* Permission control */}
              {isCurrentUser && (
                <button
                  className="absolute -right-1 -top-1 transition-opacity bg-white rounded-full p-1"
                  onClick={() =>
                    openEditModal(
                      "emergencyContact",
                      "Emergency Contact",
                      enhancedUser.emergencyContact || ""
                    )
                  }
                >
                  <PenIcon className="w-5 h-5 text-primary" />
                </button>
              )}
            </div>

            {/* Messenger */}
            <div className="flex flex-col items-center w-full md:w-9/10 opacity-40">
              <Button
                type="secondary"
                className="w-full h-13 md:h-12 !bg-primary-light !border-primary rounded-xl"
                aria-label="Messenger"
              >
                <MessageIcon className="text-primary" size={30} />
              </Button>
              <span className="mt-1 text-xs text-center text-primary">
                Messenger
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditInformationModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        fieldName={editModal.field}
        fieldLabel={editModal.label}
        initialValue={editModal.value}
        userId={enhancedUser?.userId || enhancedUser?.id}
        multiline={editModal.multiline}
        userData={enhancedUser}
        refreshUserData={forceRefresh}
      />
    </>
  );
};

export default UserProfileHeader;
