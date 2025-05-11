import React, { useState } from "react";
import Button from "../ui/Button";
import { useStableManagement } from "../../hooks/useStableManagement";
import CloseIcon from "../../assets/icons/CloseIcon";
import CheckIcon from "../../assets/icons/CheckIcon";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";

// Remove comments if we want to display sent invitations
const StableRequestsList = ({ stableId }) => {
  // const [activeTab, setActiveTab] = useState("received");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const {
    receivedRequests,
    // sentInvites,
    loading,
    approveRequest,
    rejectRequest,
    // cancelInvitation,
  } = useStableManagement(stableId);

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
    return <div className="text-center py-4">Loading requests...</div>;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm md:shadow-md p-4 md:p-6">
      {/* Header */}
      <header>
        <h2 className="font-bold mb-4 text-lg md:text-xl">
          Stable join requests
        </h2>
      </header>

      {/* Applications list */}
      <div className="space-y-1 max-h-64 md:max-h-80 lg:max-h-96 overflow-y-auto">
        {receivedRequests.map((request, index) => (
          <article
            key={`request-${request.id}-${index}`}
            className="flex flex-col md:flex-row md:items-center justify-between py-3 md:py-4 border-b border-light"
          >
            <div className="mb-2 md:mb-0">
              <h3 className="font-medium text-base md:text-lg">{`${request.firstName} ${request.lastName}`}</h3>
              <p className="text-sm text-gray">{request.email}</p>
              <p className="text-xs text-gray">
                {request.inviteDate
                  ? new Date(request.inviteDate).toLocaleDateString()
                  : "Date not available"}
              </p>
            </div>
            <div className="flex justify-end md:justify-center space-x-2">
              <Button
                type="icon"
                onClick={() => handleShowAcceptModal(request)}
                aria-label="Accept request"
                className="text-primary"
              >
                <CheckIcon strokeWidth={4} />
              </Button>
              <Button
                type="icon"
                onClick={() => handleShowRejectModal(request)}
                aria-label="Reject request"
                className="text-error-500"
              >
                <CloseIcon strokeWidth={4} />
              </Button>
            </div>
          </article>
        ))}

        {/* Display message when list is empty */}
        {receivedRequests.length === 0 && (
          <p className="py-8 text-center text-gray">No pending requests</p>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        loading={loading}
        title="Do you want to reject this request?"
        confirmButtonText="Yes"
        confirmButtonType="danger"
        cancelButtonText="No"
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
        title={`Do you want to accept ${
          selectedRequest?.firstName || "this member"
        }?`}
        confirmButtonText="Yes"
        confirmButtonType="primary"
        cancelButtonText="No"
        icon={
          <CheckIcon
            size={70}
            className="text-white"
            backgroundColor="bg-primary"
            strokeWidth={4}
          />
        }
      />
    </section>
  );
};

export default StableRequestsList;
