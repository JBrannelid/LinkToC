import React from "react";
import ModalHeader from "../components/layout/ModalHeader";
import PermissionGate from "../components/settings/PermissionGate";
import StableMembersList from "../components/settings/StableMembersList";
import StableRequestsList from "../components/settings/StableRequestsList";

import UserStableRequestsList from "../components/settings/UserStableRequestsList";
import Button from "../components/ui/Button";
import { useAppContext } from "../context/AppContext";
import { USER_ROLES } from "../utils/userUtils";

const StableManagementPage = () => {
  const { currentStable } = useAppContext();

  const handleGoBack = () => {
    window.history.back();
  };
  
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
        <div className="flex-1 px-4 py-6 md:px-8 lg:px-16 xl:px-80 ">
          <div className="max-w-4xl mx-auto space-y-6">
            <StableMembersList stableId={currentStable?.id} />
            <StableRequestsList stableId={currentStable?.id} />
            <UserStableRequestsList />

            {/* Desktop back button - only visible on lg screens */}
            <div className="hidden lg:flex justify-start">
              <Button
                type="secondary"
                onClick={handleGoBack}
                className="w-auto"
              >
                Go back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  );
};

export default StableManagementPage;
