import React from "react";
import { useRBAC } from "../../hooks/useRBAC";
import UserSettingsPage from "../../pages/UserSettingsPage";
import AdminSettingsPage from "../../pages/AdminSettingsPage";

const SettingsRouter = () => {
  const { hasAdminAccess } = useRBAC();

  return hasAdminAccess() ? <AdminSettingsPage /> : <UserSettingsPage />;
};

export default SettingsRouter;
