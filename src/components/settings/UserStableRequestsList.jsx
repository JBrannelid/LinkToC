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

  const handleGoBack = () => {
    window.history.back();
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
    <div className="flex flex-col min-h-screen bg-background pb-20 lg:pb-0">
      {/* Main content area  */}
      <div className="flex-1 px-4 py-6 md:px-8 lg:px-16 xl:px-80 mt-30">
        <div className="max-w-4xl mx-auto">
          {/* Content card */}
          <div className="bg-white rounded-lg shadow-sm md:shadow-md p-4 md:p-6">
            {/* Header */}
            <h2 className="font-bold mb-4 text-lg md:text-xl">
              Your pending stable requests
            </h2>

            {/* Sent requests list */}
            <div className="space-y-1 max-h-64 md:max-h-80 lg:max-h-96 overflow-y-auto">
              {sentRequests.map((userRequest, index) => (
                <div
                  key={`sent-${userRequest.id}-${index}`}
                  className="flex flex-col md:flex-row md:items-center justify-between py-3 md:py-4 border-b border-light"
                >
                  <div className="mb-2 md:mb-0">
                    <h3 className="font-medium text-base md:text-lg">
                      {userRequest.name}
                    </h3>
                    <p className="text-sm text-gray">
                      {userRequest.type}, {userRequest.county}
                    </p>
                    <p className="text-xs text-gray">
                      {userRequest.requestDate
                        ? new Date(userRequest.requestDate).toLocaleDateString()
                        : "Date not available"}
                    </p>
                  </div>
                  <div className="flex justify-end md:justify-center">
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
              {/* Desktop back button - only visible on lg screens */}
              <div className="hidden lg:flex justify-start mt-4">
                <Button
                  type="secondary"
                  onClick={handleGoBack}
                  className="w-auto"
                >
                  Go back
                </Button>
              </div>
              {/* Display message when the list is empty */}
              {sentRequests.length === 0 && (
                <p className="py-8 text-center text-gray">
                  No pending requests
                </p>
              )}
            </div>
          </div>
        </div>
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
