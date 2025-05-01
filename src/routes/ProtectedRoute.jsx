import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { ROUTES } from "./routeConstants";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const ProtectedRoute = ({
  children,
  requiresStable = false,
  requiredRoles = [],
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentStable, getCurrentStableRole } = useAppContext();
  const location = useLocation();
  const [roleChecked, setRoleChecked] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(true);

  useEffect(() => {
    if (requiredRoles && requiredRoles.length > 0) {
      const checkRole = async () => {
        try {
          const currentRole = await getCurrentStableRole();
          setHasRequiredRole(requiredRoles.includes(currentRole));
        } catch (error) {
          console.error("Error checking role:", error);
          setHasRequiredRole(false);
        } finally {
          setRoleChecked(true);
        }
      };

      checkRole();
    } else {
      setRoleChecked(true);
      setHasRequiredRole(true);
    }
  }, [getCurrentStableRole, requiredRoles, currentStable?.id]);

  if (isLoading || (requiredRoles.length > 0 && !roleChecked)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="medium" className="text-gray" />
        <p>Verifierar behörighet...</p>
      </div>
    );
  }

  if (!hasRequiredRole) {
    // Redirect to home if user doesn't have required role for this stable
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiresStable && !currentStable?.id) {
    // Redirect to stable selection if stable is required but not selected
    return (
      <Navigate to={ROUTES.SELECT_STABLE} state={{ from: location }} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
