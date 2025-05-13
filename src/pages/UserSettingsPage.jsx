import React from "react";
import { useNavigate } from "react-router";
import BaseSettingsPage, { SettingsMenuItem } from "./BaseSettingPage";
import { ROUTES } from "../routes/routeConstants";
import {
    handleTermsOfService,
    handleSupport,
    handleCookieSettings,
    handleStableRequests, 
    handleManageHorses,
} from "../utils/userUtils";

const UserSettingsPage = () => {
  const navigate = useNavigate();

  const renderMenuItems = ({ setShowUserEditProfileForm }) => (
    <>
      <SettingsMenuItem
        label="Edit Profile"
        onClick={() => setShowUserEditProfileForm(true)}
      />
      <SettingsMenuItem
        label="Stable Requests"
        onClick={() => handleStableRequests(navigate, ROUTES)}
      />
      <SettingsMenuItem
        label="Terms of service"
        onClick={handleTermsOfService}
      />
      <SettingsMenuItem label="Support" onClick={handleSupport} />
      <SettingsMenuItem label="Privacy Policy" onClick={handleCookieSettings} />
        <SettingsMenuItem label="Manage Horses" onClick={handleManageHorses} />
    </>
  );

  return (
    <BaseSettingsPage title="Settings" renderMenuItems={renderMenuItems} />
  );
};

export default UserSettingsPage;
