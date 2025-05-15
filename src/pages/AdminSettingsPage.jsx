import React from "react";
import { useNavigate } from "react-router";
import BaseSettingsPage, { SettingsMenuItem } from "./BaseSettingPage";
import { ROUTES } from "../routes/routeConstants";
import {
  handleTermsOfService,
  handleSupport,
  handleCookieSettings,
  handleManageStables,
  handleManageHorses,
} from "../utils/userUtils";

const AdminSettingsPage = () => {
  const navigate = useNavigate();

  const renderMenuItems = ({ setShowUserEditProfileForm }) => (
    <>
      <SettingsMenuItem
        label="Edit Profile"
        onClick={() => setShowUserEditProfileForm(true)}
      />
      <SettingsMenuItem
        label="Manage Horses"
        onClick={() => handleManageHorses(navigate, ROUTES)}
      />
      <SettingsMenuItem
        label="Manage Stables"
        onClick={() => handleManageStables(navigate, ROUTES)}
      />
      <SettingsMenuItem
        label="Terms of Service"
        onClick={handleTermsOfService}
      />
      <SettingsMenuItem label="Support" onClick={handleSupport} />
      <SettingsMenuItem label="Privacy Policy" onClick={handleCookieSettings} />
    </>
  );

  // Display user as a reminder of extra admin setting for current stable
  const renderAdminInfo = ({ currentStable }) => (
    <div className="bg-white rounded-lg p-4 flex items-center drop-shadow-lg border border-primary">
      <h3 className="text-primary text-sm">
        You are the admin of {currentStable?.name}.
      </h3>
    </div>
  );

  return (
    <BaseSettingsPage
      title="Settings"
      renderMenuItems={renderMenuItems}
      renderAdditionalContent={renderAdminInfo}
    />
  );
};

export default AdminSettingsPage;
