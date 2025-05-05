import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { USER_ROLES } from "../context/AppContext";

export function useRBAC() {
  const { getCurrentStableRole } = useAppContext();

  const hasRole = useCallback(
    (requiredRoles) => {
      if (!requiredRoles || requiredRoles.length === 0) return true;

      const currentRole = getCurrentStableRole();
      return Array.isArray(requiredRoles)
        ? requiredRoles.includes(currentRole)
        : currentRole === requiredRoles;
    },
    [getCurrentStableRole]
  );

  const hasAdminAccess = useCallback(() => {
    const currentRole = getCurrentStableRole();
    return (
      currentRole === USER_ROLES.ADMIN || currentRole === USER_ROLES.MANAGER
    );
  }, [getCurrentStableRole]);

  return { hasRole, hasAdminAccess };
}
