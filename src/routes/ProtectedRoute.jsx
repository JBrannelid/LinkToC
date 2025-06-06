import { Navigate, useLocation } from "react-router";
import { ROUTES } from "./routeConstants";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext.js";
import { useAuth } from "../hooks/useAuth.js";
import { useRBAC } from "../hooks/useRBAC";

const ProtectedRoute = ({
  children,
  requiresStable = false,
  requiredRoles = [],
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { currentStable } = useAppContext();
  const { hasRole } = useRBAC();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="medium" className="text-gray" />
        "Verifying authorization..."
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

  if (requiresStable) {
    // explicit check for undefined (user with a stable role 0, such as a stable manager)
    const hasStableAccess =
      currentStable?.id && user?.stableRoles?.[currentStable.id] !== undefined;

    if (!hasStableAccess) {
      console.warn("Access denied - no valid stable membership");
      return (
        <Navigate
          to={ROUTES.SELECT_STABLE}
          state={{ from: location }}
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;
