import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { ROUTES } from "./routeConstants";

const ProtectedRoute = ({ children, requiresStable = false }) => {
  const { isAuthenticated } = useAuth();
  const { currentStable } = useAppContext();
  const location = useLocation();

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
