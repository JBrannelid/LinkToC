import React, { useState } from "react";
import Button from "../ui/Button";
import { useUserStableRequests } from "../../hooks/useUserStableRequests";
import CloseIcon from "../../assets/icons/CloseIcon";
import CheckIcon from "../../assets/icons/CheckIcon";
import ConfirmationModal from "../ui/ConfirmationModal";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";
import LoadingSpinner from "../ui/LoadingSpinner";

const UserStableRequestsList = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    sentRequests,
    receivedInvites,
    loading,
    error,
    loadingState,
    cancelRequest,
    acceptInvite,
    rejectInvite,
  } = useUserStableRequests();

  const displayItems = activeTab === "sent" ? sentRequests : receivedInvites;

  const handleShowRejectModal = (item) => {
    setSelectedItem(item);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (selectedItem) {
      if (activeTab === "sent") {
        // Cancel a request sent by the user
        cancelRequest(selectedItem.id);
      } else {
        // Reject an invite received from a stable
        rejectInvite(selectedItem.id);
      }
      setShowRejectModal(false);
      setSelectedItem(null);
    }
  };

  const handleShowAcceptModal = (item) => {
    setSelectedItem(item);
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = () => {
    if (selectedItem) {
      acceptInvite(selectedItem.id);
      setShowAcceptModal(false);
      setSelectedItem(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <p className="ml-2">{loadingState.getMessage()}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-error-400 p-4 text-error-600">
        {error}
      </div>
    );
  }

  const getRejectModalTitle = () => {
    if (activeTab === "sent") {
      return "Cancel request?";
    }
    return "Decline invite?";
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md p-4">
      {/* Header */}
      <h2 className="font-bold mb-4">Your Invites & Requests</h2>

      {/* Tab navigation */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-2 w-full gap-2">
          <div className="flex justify-center">
            <Button
              type="secondary"
              className={`tab-button-settings no-effects !rounded-full
                ${activeTab === "sent" ? "!bg-light/40" : ""}`}
              onClick={() => setActiveTab("sent")}
            >
              <p className="text-sm">Sent requests</p>
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              type="secondary"
              className={`tab-button-settings no-effects !rounded-full
                ${activeTab === "received" ? "!bg-light/40" : ""}
              `}
              onClick={() => setActiveTab("received")}
            >
              <p className="text-sm">Received invites</p>
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
            {activeTab === "sent" ? (
              // Sent request display
              <>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray">
                    {item.type}, {item.county}
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.requestDate
                      ? new Date(item.requestDate).toLocaleDateString()
                      : "Date not available"}
                  </div>
                </div>
                <div>
                  <Button
                    type="icon"
                    onClick={() => handleShowRejectModal(item)}
                    aria-label="Cancel request"
                    className="text-error-500"
                  >
                    <CloseIcon strokeWidth={4} />
                  </Button>
                </div>
              </>
            ) : (
              // Received invite display
              <>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray">
                    {item.type}, {item.county}
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.inviteDate
                      ? new Date(item.inviteDate).toLocaleDateString()
                      : "Date not available"}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="icon"
                    onClick={() => handleShowAcceptModal(item)}
                    aria-label="Accept invite"
                    className="text-primary"
                  >
                    <CheckIcon strokeWidth={4} />
                  </Button>
                  <Button
                    type="icon"
                    onClick={() => handleShowRejectModal(item)}
                    aria-label="Decline invite"
                    className="text-error-500"
                  >
                    <CloseIcon strokeWidth={4} />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Display message when a list is empty */}
        {displayItems.length === 0 && (
          <div className="py-3 text-center text-gray">
            No {activeTab === "sent" ? "sent requests" : "received invites"}
          </div>
        )}
      </div>

      {/* Confirmation modals */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        loading={loading}
        title={getRejectModalTitle()}
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
      >
        <p>
          {activeTab === "sent"
            ? "Your request to join "
            : "The invitation from "}
          <span className="font-medium">
            {selectedItem?.name || "this stable"}
          </span>{" "}
          will be {activeTab === "sent" ? "canceled" : "declined"}.
        </p>
      </ConfirmationModal>

      {/* Accept Invitation Modal */}
      <ConfirmationModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleConfirmAccept}
        loading={loading}
        title="Accept invitation?"
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
      >
        <p>
          You will join{" "}
          <span className="font-medium">
            {selectedItem?.name || "this stable"}
          </span>{" "}
          as a new member.
        </p>
      </ConfirmationModal>
    </div>
  );
};

export default UserStableRequestsList;
