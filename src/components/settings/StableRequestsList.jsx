import React, { useState } from "react";
import Button from "../ui/Button";
import { useStableManagement } from "../../hooks/useStableManagement";
import CloseIcon from "../../assets/icons/CloseIcon";
import CheckIcon from "../../assets/icons/CheckIcon";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";

const StableRequestsList = ({ stableId }) => {
  const [activeTab, setActiveTab] = useState("received");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const {
    receivedRequests,
    sentRequests,
    loading,
    approveRequest,
    rejectRequest,
  } = useStableManagement(stableId);

  const requests = activeTab === "received" ? receivedRequests : sentRequests;

  const handleShowRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (selectedRequest) {
      rejectRequest(selectedRequest.id);
      setShowRejectModal(false);
      setSelectedRequest(null);
    }
  };

  const handleShowAcceptModal = (request) => {
    setSelectedRequest(request);
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = () => {
    if (selectedRequest) {
      approveRequest(selectedRequest.id);
      setShowAcceptModal(false);
      setSelectedRequest(null);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Laddar förfrågningar...</div>;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md p-4">
      {/* Header */}
      <h2 className="font-bold mb-4">Förfrågningar</h2>

      {/* Tab navigation */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-2 w-full gap-2">
          <div className="flex justify-center">
            <Button
              type="secondary"
              className={`tab-button-settings no-effects !rounded-full
          ${activeTab === "received" ? "!bg-light/40" : ""}
        `}
              onClick={() => setActiveTab("received")}
            >
              <p className="text-sm">Mottagna</p>
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              type="secondary"
              className={`tab-button-settings no-effects !rounded-full
                ${activeTab === "sent" ? "!bg-light/40" : ""}`}
              onClick={() => setActiveTab("sent")}
            >
              <p className="text-sm">Skickade</p>
            </Button>
          </div>
        </div>
      </div>

      {/* Requests list */}
      <div className="space-y-1">
        {requests.map((request) => (
          <div
            key={`request-${request.id}-${index}`}
            className="flex items-center justify-between py-3 border-b border-light"
          >
            <div>
              <div className="font-medium">{`${request.firstName} ${request.lastName}`}</div>
              <div className="text-sm text-gray-500">{request.email}</div>
            </div>
            {activeTab === "received" && (
              <div className="flex space-x-2">
                <Button
                  type="icon"
                  onClick={() => handleShowAcceptModal(request)}
                  aria-label="Godkänn förfrågan"
                >
                  <CheckIcon strokeWidth={4} />
                </Button>
                <Button
                  type="icon"
                  onClick={() => handleShowRejectModal(request)}
                  aria-label="Avvisa förfrågan"
                >
                  <CloseIcon strokeWidth={4} />
                </Button>
              </div>
            )}
          </div>
        ))}
        {/* Display mottagna or skickade depending on active button */}
        {requests.length === 0 && (
          <div className="py-3 text-center text-gray">
            Inga {activeTab === "received" ? "mottagna" : "skickade"}
            förfrågningar
          </div>
        )}
      </div>

      {/* Confirmation modals remain the same */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        loading={loading}
        title={`Vill du ta bort inbjudan?`}
        confirmButtonText="Ja"
        confirmButtonType="danger"
        cancelButtonText="Nej"
        icon={
          <HandRaisedIcon
            size={70}
            backgroundColor="bg-error-500"
            iconColor="text-white"
          />
        }
      />
      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleConfirmAccept}
        loading={loading}
        title={`Vill du acceptera ${
          selectedRequest?.firstName || "denna medlem"
        }?`}
        confirmButtonText="Ja"
        confirmButtonType="primary"
        cancelButtonText="Nej"
        icon={
          <CheckIcon
            size={70}
            className="text-white"
            backgroundColor="bg-primary"
            strokeWidth={4}
          />
        }
      />
    </div>
  );
};

export default StableRequestsList;
