import React, { useState } from "react";
import { useNavigate } from "react-router";
import LogoutIcon from "../assets/icons/LogoutIcon";
import PenIcon from "../assets/icons/PenIcon";
import ProfileImage from "../components/common/ProfileImage.jsx";
import UserProfileForm from "../components/forms/UserProfileForm";
import ModalHeader from "../components/layout/ModalHeader";
import Button from "../components/ui/Button";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext.js";
import { useAuth } from "../hooks/useAuth.js";
import { useUserData } from "../hooks/useUserData";
import { ROUTES } from "../routes/index.jsx";
import { handleSwitchStable, formatUserFullName } from "../utils/userUtils";

// Reusable menu item component
export const SettingsMenuItem = ({ label, onClick, icon }) => (
  <Button
    type="secondary"
    className="w-full text-left justify-start px-4"
    onClick={onClick}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {label}
  </Button>
);

// Base settings page that both user and admin pages will extend
const BaseSettingsPage = ({
  title = "Settings",
  renderMenuItems,
  renderAdditionalContent: renderAdminInfo,
  showProfileEdit = true,
}) => {
  const { logout, user } = useAuth();
  const { currentStable, getCurrentStableRole } = useAppContext();
  const currentRole = getCurrentStableRole();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showUserEditProfileForm, setShowUserEditProfileForm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Fetch user data with error and load handling
  const {
    userData,
    userLoading,
    userError,
    loadingState,
    fetchAndUpdateUserData,
  } = useUserData();

  // Display fresh user data after update
  const handleProfileUpdateSuccess = () => {
    fetchAndUpdateUserData();
    setShowUserEditProfileForm(false);
  };

  // Display loading spinner
  if (userLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="medium" className="text-gray" />
        <p className="ml-2">{loadingState.getMessage()}</p>
      </div>
    );
  }

  const handleShowLogoutModal = () => {
    setShowLogoutConfirm(true);
  };
  const handleLogoutConfirmed = async () => {
    try {
      setLoading(true);
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  // Get data from database (userData) or JWT (user)
  const displayUser = userData || user;
  const userFullName = formatUserFullName(displayUser);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 lg:p-0 overflow-y-hidden ">
      {/* Header */}
      <div className="bg-primary-light lg:bg-background border-b-1 border-light ">
        <ModalHeader title={title} />
      </div>

      <div className="flex-1 px-4 py-6 space-y-4 md:px-50 xl:px-100">
        {/* User profile section */}
        <div className="bg-white rounded-lg p-4 flex items-center drop-shadow-lg">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <ProfileImage
              user={displayUser}
              className="w-full h-full"
              size="rounded"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">{userFullName}</h3>
            <p className="text-grey">
              {displayUser?.email || "No email address registered"}
            </p>
          </div>
          {showProfileEdit && (
            <Button
              onClick={() => setShowUserEditProfileForm(true)}
              className="p-2 text-primary"
              type="icon"
              aria-label="Edit user profile"
            >
              <PenIcon className="w-9 h-9" />
            </Button>
          )}
        </div>
        {/* Optional additional content */}
        {renderAdminInfo && renderAdminInfo({ currentRole, currentStable })}

        {/* If user data fetch failed */}
        {userError && (
          <div className="bg-red-50 border-l-4 border-error-400 p-4 text-error-600">
            {userError}
          </div>
        )}

        {/* Menu buttons - rendered by the implementing component */}
        <div className="space-y-4">
          {renderMenuItems({
            setShowUserEditProfileForm,
            navigate,
            currentRole,
            currentStable,
          })}
        </div>

        {/* Action buttons */}
        <div className="pt-8 space-y-4">
          <div className="grid grid-cols-1 justify-items-center gap-5">
            <Button
              type="primary"
              className="w-9/10"
              onClick={() => handleSwitchStable(navigate, ROUTES)}
            >
              Change stable
            </Button>

            <Button
              type="secondary"
              className="w-9/10"
              onClick={handleShowLogoutModal}
              loading={loading}
            >
              Log out
            </Button>
          </div>
        </div>
        <ConfirmationModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogoutConfirmed}
          loading={loading}
          title="Do you want to log out?"
          confirmButtonText="Log out"
          confirmButtonType="danger"
          icon={
            <LogoutIcon
              size={70}
              backgroundColor="bg-error-500"
              iconColor="text-white"
            />
          }
        ></ConfirmationModal>
      </div>

      {/* Display User profile form */}
      {showUserEditProfileForm && (
        <UserProfileForm
          onClose={() => setShowUserEditProfileForm(false)}
          onSuccess={handleProfileUpdateSuccess}
          userData={userData}
        />
      )}
    </div>
  );
};

export default BaseSettingsPage;
