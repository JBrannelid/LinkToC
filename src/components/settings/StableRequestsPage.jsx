import React from "react";
import ModalHeader from "../components/layout/ModalHeader";
import { useAppContext } from "../context/AppContext";
import StableRequestsList from "../components/settings/StableRequestsList";

const StableRequestsPage = () => {
  const { currentStable } = useAppContext();

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
        <StableRequestsList stableId={currentStable?.id} />
      </div>
    </div>
  );
};

export default StableRequestsPage;
