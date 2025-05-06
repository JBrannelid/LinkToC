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
    sentInvites,
    loading,
    approveRequest,
    rejectRequest,
    cancelInvitation,
  } = useStableManagement(stableId);

  const displayItems =
    activeTab === "received" ? receivedRequests : sentInvites;

  const handleShowRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (selectedRequest) {
      if (activeTab === "sent") {
        cancelInvitation(selectedRequest.id);
      } else {
        rejectRequest(selectedRequest.id);
      }
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

  const getRejectModalTitle = () => {
    if (activeTab === "sent") {
      return "Vill du dra tillbaka inbjudan?";
    }
    return "Vill du ta bort förfrågan?";
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md p-4">
      {/* Header */}
      <h2 className="font-bold mb-4">Stable requests</h2>

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
              <p className="text-sm">Applications </p>
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              type="secondary"
              className={`tab-button-settings no-effects !rounded-full
                ${activeTab === "sent" ? "!bg-light/40" : ""}`}
              onClick={() => setActiveTab("sent")}
            >
              <p className="text-sm">Invitations</p>
            </Button>
          </div>
        </div>
      </div>

      {/* Requests/Invites list */}
      <div className="space-y-1">
        {displayItems.map((item, index) => (
          <div
            key={`${activeTab}-${item.id}-${index}`}
            className="flex items-center justify-between py-3 border-b border-light"
          >
            {activeTab === "received" ? (
              // Received request
              <>
                <div>
                  <div className="font-medium">{`${item.firstName} ${item.lastName}`}</div>
                  <div className="text-sm text-gray-500">{item.email}</div>
                  <div className="text-xs text-gray-400">
                    {item.inviteDate
                      ? new Date(item.inviteDate).toLocaleDateString()
                      : "Datum saknas"}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="icon"
                    onClick={() => handleShowAcceptModal(item)}
                    aria-label="Godkänn förfrågan"
                    className="text-primary"
                  >
                    <CheckIcon strokeWidth={4} />
                  </Button>
                  <Button
                    type="icon"
                    onClick={() => handleShowRejectModal(item)}
                    aria-label="Avvisa förfrågan"
                    className="text-error-500"
                  >
                    <CloseIcon strokeWidth={4} />
                  </Button>
                </div>
              </>
            ) : (
              // Sent invite display - now with withdraw button
              <>
                <div>
                  <div className="font-medium">{`${item.firstName} ${item.lastName}`}</div>
                  <div className="text-sm text-gray-500">{item.email}</div>
                  <div className="text-xs text-gray-400">
                    {item.inviteDate
                      ? new Date(item.inviteDate).toLocaleDateString()
                      : "Datum saknas"}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="icon"
                    onClick={() => handleShowRejectModal(item)}
                    aria-label="Dra tillbaka inbjudan"
                    className="text-error-500"
                  >
                    <CloseIcon strokeWidth={4} />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Display message when send och invite display is empty */}
        {displayItems.length === 0 && (
          <div className="py-3 text-center text-gray">
            Inga{" "}
            {activeTab === "received"
              ? "mottagna förfrågningar"
              : "skickade inbjudningar"}
          </div>
        )}
      </div>

      {/* Confirmation modals with dynamic title */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        loading={loading}
        title={getRejectModalTitle()}
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
