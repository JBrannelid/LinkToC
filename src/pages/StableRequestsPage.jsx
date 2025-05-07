import React from "react";
import ModalHeader from "../components/layout/ModalHeader";
import { useAppContext } from "../context/AppContext";
import { useRBAC } from "../hooks/useRBAC";
import { USER_ROLES } from "../context/AppContext";
import StableRequestsList from "../components/settings/StableRequestsList";
import UserStableRequestsList from "../components/settings/UserStableRequestsList";

const StableRequestsPage = () => {
  const { currentStable } = useAppContext();
  const { hasRole } = useRBAC();

  // Check if user is admin or manager to determine which view to show
  const isAdmin = hasRole([USER_ROLES.ADMIN, USER_ROLES.MANAGER]);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
      <div className="bg-primary-light">
        <ModalHeader
          title="Stallförfrågningar"
          showCloseBtn={false}
          onCloseClick={() => window.history.back()}
        />
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {isAdmin ? (
          // Admin view
          <StableRequestsList stableId={currentStable?.id} />
        ) : (
          // User view
          <UserStableRequestsList />
        )}
      </div>
    </div>
  );
};

export default StableRequestsPage;
