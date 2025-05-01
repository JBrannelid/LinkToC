import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { USER_ROLES } from "../../context/AppContext";
import UserSettingsPage from "../../pages/UserSettingsPage";
import AdminSettingsPage from "../../pages/AdminSettingsPage";

// Decide routing based on the user's role in the current stable
const SettingsRouter = () => {
  const { getCurrentStableRole } = useAppContext();
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const role = await getCurrentStableRole();
        setCurrentRole(role);
      } catch (error) {
        console.error("Error checking role:", error);
        setCurrentRole(USER_ROLES.USER); // Fallback
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [getCurrentStableRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner size="medium" className="text-gray" />
        <p>Laddar inställningar...</p>
      </div>
    );
  }

  // Pass admin routes
  if (currentRole === USER_ROLES.ADMIN || currentRole === USER_ROLES.MANAGER) {
    return <AdminSettingsPage />;
  }

  return <UserSettingsPage />;
};

export default SettingsRouter;
