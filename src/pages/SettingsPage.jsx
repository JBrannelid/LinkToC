import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { ROUTES } from "../routes/routeConstants";
import Button from "../components/ui/Button";
import ModalHeader from "../components/layout/ModalHeader";

const SettingsPage = () => {
  const { logout, user } = useAuth();
  const { currentStable } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle navigation to profile edit page
  const handleEditProfile = () => {
    // Implement Logic
    console.log("Edit profile clicked");
  };

  // Handle navigation to stable management page
  const handleManageStables = () => {
    console.log("Manage Stables clicked");
  };

  // Handle terms of service navigation
  const handleTermsOfService = () => {
    console.log("Terms of service clicked");
  };

  // Handle support navigation
  const handleSupport = () => {
    console.log("Support clicked");
  };

  // Handle cookie settings
  const handleCookieSettings = () => {
    console.log("Cookie settings clicked");
  };

  // Handle switch stable action
  const handleSwitchStable = () => {
    navigate(ROUTES.SELECT_STABLE);
  };

  // Handle logout action
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
      {/* Header with primary-light background */}
      <div className="bg-primary-light">
        <ModalHeader title="Inställningar" />
      </div>

      <div className="flex-1 px-4 py-6 space-y-4">
        {/* User profile section */}
        <div className="bg-white rounded-lg p-4 flex items-center drop-shadow-lg">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img
              src={
                user?.profileImage || "/src/assets/images/userPlaceholder.jpg"
              }
              alt="Profile image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">
              {user?.firstName} {user?.lastName || "Test Testsson"}
            </h3>
            <p className="text-gray-600">{user?.email || "namn@gmail.com"}</p>
          </div>
          <Button
            onClick={handleEditProfile}
            className="p-2 text-primary"
            type="icon"
            aria-label="Redigera användarprofil"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        </div>

        {/* Menu items */}
        <Button
          type="secondary"
          className="w-full text-left justify-start px-4"
          onClick={handleEditProfile}
        >
          Redigera profil
        </Button>

        <Button
          type="secondary"
          className="w-full text-left justify-start px-4"
          onClick={handleManageStables}
        >
          Hantera stall
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
              onClick={handleSwitchStable}
            >
              Byt stall
            </Button>

            <Button
              type="secondary"
              className="w-9/10 "
              onClick={handleLogout}
              loading={loading}
            >
              Logga ut
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
