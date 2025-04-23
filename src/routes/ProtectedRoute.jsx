import { Navigate, useLocation } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ children, requiresStable = false }) => {
  const { isAuthenticated, user } = useAuth();
  const { currentStable } = useAppContext();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresStable && !currentStable?.id) {
    // Redirect to stable selection if stable is required but not selected
    return <Navigate to="/select-stable" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
