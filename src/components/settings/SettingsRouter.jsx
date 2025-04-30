import React from "react";
import { useAppContext } from "../../context/AppContext";
import { USER_ROLES } from "../../context/AppContext";
import UserSettingsPage from "../../pages/UserSettingsPage";
import AdminSettingsPage from "../../pages/AdminSettingsPage";

// Decide routing based on the user's role in the current stable
const SettingsRouter = () => {
  const { getCurrentStableRole } = useAppContext();

  const currentRole = getCurrentStableRole();

  // Pass admin routes
  if (currentRole === USER_ROLES.ADMIN || USER_ROLES === USER_ROLES.MANAGER) {
    return <AdminSettingsPage />;
  }

  if (currentRole === USER_ROLES.USER) {
    // Pass user routes
    return <UserSettingsPage />;
  }
};

export default SettingsRouter;
