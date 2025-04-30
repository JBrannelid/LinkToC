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
  const { currentStable } = useAppContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="medium" className="text-gray" />
        <p>Verifierar autentisering...</p>
      </div>
    );
  }

  // Check if user has one of the required roles for the current stable
  const checkUserRole = () => {
    // Allow access even if the user haven't recived a role for development testing
    // Need to be removed when implementation is done from be
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const currentRole = getCurrentStableRole();

    return requiredRoles.includes(currentRole);
  };

  if (!checkUserRole()) {
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
