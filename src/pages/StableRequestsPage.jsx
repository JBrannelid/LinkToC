import React from "react";
import ModalHeader from "../components/layout/ModalHeader";
import StableRequestsList from "../components/settings/StableRequestsList";
import UserStableRequestsList from "../components/settings/UserStableRequestsList";
import { useAppContext } from "../hooks/useAppContext.js";
import { useRBAC } from "../hooks/useRBAC";
import { USER_ROLES } from "../utils/userUtils";

const StableRequestsPage = () => {
  const { currentStable } = useAppContext();
  const { hasRole } = useRBAC();

  // Check if user is admin or manager to determine which view to show
  const isAdmin = hasRole([USER_ROLES.ADMIN, USER_ROLES.MANAGER]);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-35 overflow-y-hidden">
      <div className="bg-primary-light lg:hidden">
        <ModalHeader
          title="Stable requests"
          showCloseBtn={false}
          onCloseClick={() => window.history.back()}
        />
      </div>
      <div className="flex-1 px-4 py-6 md:px-8 lg:px-16 xl:px-80">
        <div className="max-w-4xl mx-auto space-y-6">
          {isAdmin ? (
            // Admin view
            <StableRequestsList stableId={currentStable?.id} />
          ) : (
            // User view
            <UserStableRequestsList />
          )}
        </div>
      </div>
    </div>
  );
};

export default StableRequestsPage;
