import React from "react";
import { useRBAC } from "../../hooks/useRBAC";
import AdminSettingsPage from "../../pages/AdminSettingsPage";
import UserSettingsPage from "../../pages/UserSettingsPage";

const SettingsRouter = () => {
  const { hasAdminAccess } = useRBAC();

  return hasAdminAccess() ? <AdminSettingsPage /> : <UserSettingsPage />;
};

export default SettingsRouter;
