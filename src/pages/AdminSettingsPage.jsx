import React from "react";
import { useNavigate } from "react-router";
import BaseSettingsPage, { SettingsMenuItem } from "./BaseSettingPage";
import { ROUTES } from "../routes/routeConstants";
import {
  handleTermsOfService,
  handleSupport,
  handleCookieSettings,
  handleManageStables,
} from "../utils/userUtils";

const AdminSettingsPage = () => {
  const navigate = useNavigate();

  const renderMenuItems = ({ setShowUserEditProfileForm }) => (
    <>
      <SettingsMenuItem
        label="Redigera profil"
        onClick={() => setShowUserEditProfileForm(true)}
      />
      <SettingsMenuItem
        label="Hantera stall"
        onClick={() => handleManageStables(navigate, ROUTES)}
      />
      <SettingsMenuItem
        label="Terms of service"
        onClick={handleTermsOfService}
      />
      <SettingsMenuItem label="Support" onClick={handleSupport} />
      <SettingsMenuItem
        label="Cookie inställningar"
        onClick={handleCookieSettings}
      />
    </>
  );

  // Display user as a reminder of extra admin setting for current stable
  const renderAdminInfo = ({ currentStable }) => (
    <div className="bg-white rounded-lg p-4 flex items-center drop-shadow-lg border border-primary">
      <h3 className="text-primary text-sm">
        Du är admin för {currentStable?.name}.
      </h3>
    </div>
  );

  return (
    <BaseSettingsPage
      title="Inställningar"
      renderMenuItems={renderMenuItems}
      renderAdditionalContent={renderAdminInfo}
    />
  );
};

export default AdminSettingsPage;
