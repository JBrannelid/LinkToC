import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routeConstants";
import Button from "../components/ui/Button";
import ModalHeader from "../components/layout/ModalHeader";
import UserProfileForm from "../components/forms/UserProfileForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useUserData } from "../hooks/useUserData";
import PenIcon from "../assets/icons/PenIcon";
import {
  handleManageStables,
  handleTermsOfService,
  handleSupport,
  handleCookieSettings,
  handleSwitchStable,
  handleLogout,
  formatUserFullName,
  getProfileImageUrl,
} from "../utils/userUtils";

const SettingsPage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showUserEditProfilForm, setShowUserEditProfilForm] = useState(false);

  // Fetch user data with error and load handeling
  const { userData, userLoading, userError, loadingState, fetchUserData } =
    useUserData();

  // Handle navigation to profile edit page
  const handleEditProfile = () => {
    setShowUserEditProfilForm(true);
  };

  // Display fresh user data after update
  const handleProfileUpdateSuccess = () => {
    fetchUserData();
    setShowUserEditProfilForm(false);
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

  // Get data from database (userData) or JWT (user)
  const displayUser = userData || user;
  const userFullName = formatUserFullName(displayUser);
  const profileImageUrl = getProfileImageUrl(displayUser?.profileImage);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
      {/* Header */}
      <div className="bg-primary-light">
        <ModalHeader title="Inställningar" />
      </div>

      <div className="flex-1 px-4 py-6 space-y-4">
        {/* User profile section */}
        <div className="bg-white rounded-lg p-4 flex items-center drop-shadow-lg">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img
              src={profileImageUrl}
              alt={`Profile image of ${userFullName}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">{userFullName}</h3>
            <p className="text-grey">
              {displayUser?.email || "Inge mailadress registrerad"}
            </p>
          </div>
          <Button
            onClick={() => handleEditProfile(setShowUserEditProfilForm)}
            className="p-2 text-primary"
            type="icon"
            aria-label="Redigera användarprofil"
          >
            <PenIcon className="w-9 h-9" />
          </Button>
        </div>

        {/* If user data fetch failed */}
        {userError && (
          <div className="bg-red-50 border-l-4 border-error-400 p-4 text-error-600">
            {userError}
          </div>
        )}

        {/* Menu buttons */}
        <Button
          type="secondary"
          className="w-full text-left justify-start px-4"
          onClick={() => handleEditProfile(setShowUserEditProfilForm)}
        >
          Redigera profil
        </Button>

        <Button
          type="secondary"
          className="w-full text-left justify-start px-4"
          onClick={handleManageStables}
        >
          Stallförfrågningar
        </Button>

        <Button
          type="secondary"
          className="w-full text-left justify-start px-4"
          onClick={handleTermsOfService}
        >
          Terms of service
        </Button>

        <Button
          type="secondary"
          className="w-full text-left justify-start px-4"
          onClick={handleSupport}
        >
          Support
        </Button>

        <Button
          type="secondary"
          className="w-full text-left justify-start px-4"
          onClick={handleCookieSettings}
        >
          Cookie inställningar
        </Button>

        {/* Action buttons */}
        <div className="pt-8 space-y-4">
          <div className="grid grid-cols-1 justify-items-center gap-5">
            <Button
              type="primary"
              className="w-9/10"
              onClick={() => handleSwitchStable(navigate, ROUTES)}
            >
              Byt stall
            </Button>

            <Button
              type="secondary"
              className="w-9/10 "
              onClick={() => handleLogout(logout, navigate, setLoading, ROUTES)}
              loading={loading}
            >
              Logga ut
            </Button>
          </div>
        </div>
      </div>

      {/* Display User profile form */}
      {showUserEditProfilForm && (
        <UserProfileForm
          onClose={() => setShowUserEditProfilForm(false)}
          onSuccess={handleProfileUpdateSuccess}
          userData={userData}
        />
      )}
    </div>
  );
};

export default SettingsPage;
