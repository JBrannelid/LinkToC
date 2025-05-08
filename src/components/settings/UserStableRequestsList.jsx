import React, { useState } from "react";
import Button from "../ui/Button";
import { useUserStableRequests } from "../../hooks/useUserStableRequests";
import CloseIcon from "../../assets/icons/CloseIcon";
import ConfirmationModal from "../ui/ConfirmationModal";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";
import LoadingSpinner from "../ui/LoadingSpinner";

const UserStableRequestsList = () => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { sentRequests, loading, error, loadingState, cancelRequest } =
    useUserStableRequests();

  const handleShowRejectModal = (item) => {
    setSelectedItem(item);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (selectedItem) {
      // Cancel a request sent by the user
      cancelRequest(selectedItem.id);
      setShowRejectModal(false);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header */}
      <h2 className="font-bold mb-4">Your stable requests</h2>
      {/* Sent requests list */}
      <div className="space-y-1 max-h-80 overflow-y-auto ">
        {sentRequests.map((userRequest, index) => (
          <div
            key={`sent-${userRequest.id}-${index}`}
            className="flex items-center justify-between py-3 border-b border-light"
          >
            <div>
              <h3 className="font-medium">{userRequest.name}</h3>
              <p className="text-sm text-gray">
                {userRequest.type}, {userRequest.county}
              </p>
              <p className="text-xs text-gray-400">
                {userRequest.requestDate
                  ? new Date(userRequest.requestDate).toLocaleDateString()
                  : "Date not available"}
              </p>
            </div>
            <div>
              <Button
                type="icon"
                onClick={() => handleShowRejectModal(userRequest)}
                aria-label="Cancel request"
                className="text-error-500"
              >
                <CloseIcon strokeWidth={4} />
              </Button>
            </div>
          </div>
        ))}

        {/* Display message when the list is empty */}
        {sentRequests.length === 0 && (
          <p className="py-3 text-center text-gray">No sent requests</p>
        )}
      </div>

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        loading={loading}
        title="Cancel request?"
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
          Your request to join{" "}
          <span className="font-medium">
            {selectedItem?.name || "this stable"}
          </span>{" "}
          will be canceled.
        </p>
      </ConfirmationModal>
    </div>
  );
};

export default UserStableRequestsList;
