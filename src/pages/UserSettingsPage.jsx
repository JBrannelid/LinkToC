import React from "react";
import { useNavigate } from "react-router";
import BaseSettingsPage, { SettingsMenuItem } from "./BaseSettingPage";
import { ROUTES } from "../routes/routeConstants";
import {
  handleTermsOfService,
  handleSupport,
  handleCookieSettings,
  handleStableRequests,
} from "../utils/userUtils";

const UserSettingsPage = () => {
  const navigate = useNavigate();

  const renderMenuItems = ({ setShowUserEditProfileForm }) => (
    <>
      <SettingsMenuItem
        label="Redigera profil"
        onClick={() => setShowUserEditProfileForm(true)}
      />
      <SettingsMenuItem
        label="Stallförfrågningar"
        onClick={() => handleStableRequests(navigate, ROUTES)}
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
