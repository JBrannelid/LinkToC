import { useRBAC } from "../../hooks/useRBAC";

const PermissionGate = ({ requiredRoles, children, fallback = null }) => {
  const { hasRole } = useRBAC();

  if (hasRole(requiredRoles)) {
    return children;
  }

  return fallback;
};

export default PermissionGate;

// Use for conditional UI rendering based on roles.
// Wrap component with PermissionGate
/*         
<PermissionGate
    requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}
    >
    <Button type="secondary" onClick={toggleForm}>
        {isFormOpen ? "Avbryt" : wallPost?.title ? "Redigera" : "Skapa"}
    </Button>
</PermissionGate>*/

