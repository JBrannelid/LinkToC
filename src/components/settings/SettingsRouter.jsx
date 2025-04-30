import React from "react";
import { useAppContext } from "../../context/AppContext";
import { ROLES } from "../../utils/userUtils";
import UserSettingsPage from "../../pages/UserSettingsPage";
import AdminSettingsPage from "../../pages/AdminSettingsPage";

// Decide routing based on the user's role in the current stable
const SettingsRouter = () => {
  const { getCurrentStableRole } = useAppContext();

  const currentRole = getCurrentStableRole();

  // Pass admin routes
  if (currentRole === ROLES.USER_ADMIN || currentRole === ROLES.MASTER_ADMIN) {
    return <AdminSettingsPage />;
  }

  // Pass user routes
  return <UserSettingsPage />;
};

export default SettingsRouter;
