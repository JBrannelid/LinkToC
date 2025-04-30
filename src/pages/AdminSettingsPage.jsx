import React from "react";
import BaseSettingsPage, { SettingsMenuItem } from "./BaseSettingPage";
import {
  handleTermsOfService,
  handleSupport,
  handleCookieSettings,
  handleManageStables,
} from "../utils/userUtils";

const AdminSettingsPage = () => {
  const renderMenuItems = ({ setShowUserEditProfileForm }) => (
    <>
      <SettingsMenuItem
        label="Redigera profil"
        onClick={() => setShowUserEditProfileForm(true)}
      />
      <SettingsMenuItem label="Hantera stall" onClick={handleManageStables} />
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

  // Add fallback for currentStable name
  const renderAdditionalContent = ({ currentStable }) => (
    <div className="bg-white rounded-lg p-4 mt-4">
      <h3 className="font-medium mb-2">Admin Information</h3>
      <p className="text-sm text-gray">
        Du är admin för {currentStable?.name}.
      </p>
    </div>
  );

  return (
    <BaseSettingsPage
      title="Admin Inställningar"
      renderMenuItems={renderMenuItems}
      renderAdditionalContent={renderAdditionalContent}
    />
  );
};

export default AdminSettingsPage;
