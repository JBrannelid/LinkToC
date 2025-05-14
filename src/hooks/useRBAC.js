import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { USER_ROLES } from "../utils/userUtils";

export function useRBAC() {
  const { getCurrentStableRole } = useAppContext();

  const hasRole = useCallback(
    (requiredRoles) => {
      const currentRole = getCurrentStableRole();
      if (!requiredRoles?.length) return true;

      // Ensures requiredRoles is treated as an array and checks for inclusion
      const roles = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];
      return roles.includes(currentRole);
    },
    [getCurrentStableRole]
  );

  const hasAdminAccess = useCallback(() => {
    const currentRole = getCurrentStableRole();

    // Checks if the current role is either ADMIN or MANAGER
    return [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(currentRole);
  }, [getCurrentStableRole]);

  return { hasRole, hasAdminAccess };
}
