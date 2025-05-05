import React from "react";
import BaseSettingsPage, { SettingsMenuItem } from "./BaseSettingPage";
import {
  handleTermsOfService,
  handleSupport,
  handleCookieSettings,
  handleManageStables,
} from "../utils/userUtils";

const UserSettingsPage = () => {
  // Only destructure what you need
  const renderMenuItems = ({ setShowUserEditProfileForm }) => (
    <>
      <SettingsMenuItem
        label="Redigera profil"
        onClick={() => setShowUserEditProfileForm(true)}
      />
      <SettingsMenuItem
        label="Stallförfrågningar"
        onClick={handleManageStables}
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

  return (
    <BaseSettingsPage title="Inställningar" renderMenuItems={renderMenuItems} />
  );
};

export default UserSettingsPage;
