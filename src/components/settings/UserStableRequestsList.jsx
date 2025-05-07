import React, { useState } from "react";
import Button from "../ui/Button";
import { useUserStableRequests } from "../../hooks/useUserStableRequests";
import CloseIcon from "../../assets/icons/CloseIcon";
import ConfirmationModal from "../ui/ConfirmationModal";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";
import LoadingSpinner from "../ui/LoadingSpinner";

const UserStableRequestsList = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [chosenStable, setChosenStable] = useState(null);
  const { stableRequests, loading, cancelRequest, error, loadingState } =
    useUserStableRequests();

  const handleShowCancelModal = (stable) => {
    setChosenStable(stable);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!chosenStable) return;

    try {
      const success = await cancelRequest(chosenStable.id);
      if (!success) return;

      setShowCancelModal(false);
      setChosenStable(null);
    } catch (error) {
      console.error("Error during cancellation:", error);
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
    <div className="bg-white rounded-lg overflow-hidden shadow-md p-4 mt-5">
      <h2 className="font-bold mb-4">My stable requests</h2>

      {stableRequests.length > 0 ? (
        <div className="space-y-1">
          {stableRequests.map((stable) => (
            <div
              key={`stable-${stable.id}`}
              className="flex items-center justify-between py-3 border-b border-light"
            >
              <div>
                <div className="font-medium">{stable.name}</div>
                <div className="text-sm text-gray">
                  {stable.type}, {stable.county}
                </div>
              </div>
              <div>
                <Button
                  type="icon"
                  onClick={() => handleShowCancelModal(stable)}
                  aria-label="Avbryt förfrågan"
                  className="text-error-500"
                >
                  <CloseIcon strokeWidth={4} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-3 text-center">
          <p className="text-gray">Du har inga aktiva stallförfrågningar</p>
        </div>
      )}

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        loading={loading}
        title="Cancel request?"
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
      >
        <p>
          Your request to join
          <span className="font-medium">
            {" "}
            {chosenStable?.name || "this stable"}
          </span>{" "}
          will be removed.
        </p>
      </ConfirmationModal>
    </div>
  );
};

export default UserStableRequestsList;
