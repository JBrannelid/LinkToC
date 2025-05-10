import React from "react";
import ModalHeader from "../components/layout/ModalHeader";
import { useAppContext } from "../context/AppContext";
import StableMembersList from "../components/settings/StableMembersList";
import StableRequestsList from "../components/settings/StableRequestsList";
import PermissionGate from "../components/settings/PermissionGate";
import { USER_ROLES } from "../context/AppContext";
import UserStableRequestsList from "../components/settings/UserStableRequestsList";

const StableManagementPage = () => {
  const { currentStable } = useAppContext();

  return (
    <PermissionGate requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
      <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
        <div className="bg-primary-light lg:bg-background">
          <ModalHeader
            title="Manage Stables"
            showCloseBtn={false}
            onCloseClick={() => window.history.back()}
          />
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <StableMembersList stableId={currentStable?.id} />
          <StableRequestsList stableId={currentStable?.id} />
          {/* Add user's own stable requests */}
          <div className="mt-6">
            <UserStableRequestsList />
          </div>
        </div>
      </div>
    </PermissionGate>
  );
};

export default StableManagementPage;
