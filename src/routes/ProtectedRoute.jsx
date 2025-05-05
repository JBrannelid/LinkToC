import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { useRBAC } from "../hooks/useRBAC";
import { ROUTES } from "./routeConstants";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const ProtectedRoute = ({
  children,
  requiresStable = false,
  requiredRoles = [],
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentStable } = useAppContext();
  const { hasRole } = useRBAC();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="medium" className="text-gray" />
        <p>Verifierar behörighet...</p>
      </div>
    );
  }

  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    // Redirect to home if user doesn't have required role
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
