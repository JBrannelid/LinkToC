import React, { useState } from "react";
import Button from "../ui/Button";
import { useStableManagement } from "../../hooks/useStableManagement";
import CloseIcon from "../../assets/icons/CloseIcon";
import CheckIcon from "../../assets/icons/CheckIcon";

const StableRequestsList = ({ stableId }) => {
  const [activeTab, setActiveTab] = useState("received");
  const {
    receivedRequests,
    sentRequests,
    loading,
    approveRequest,
    rejectRequest,
  } = useStableManagement(stableId);

  const requests = activeTab === "received" ? receivedRequests : sentRequests;

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
            key={request.id}
            className="flex items-center justify-between py-3 border-b border-light"
          >
            <div>{`${request.firstName} ${request.lastName}`}</div>
            {activeTab === "received" && (
              <div className="flex space-x-2">
                <Button
                  type="icon"
                  onClick={() => approveRequest(request.id)}
                  aria-label="Godkänn förfrågan"
                >
                  <CheckIcon strokeWidth={4} />
                </Button>
                <Button
                  type="icon"
                  onClick={() => rejectRequest(request.id)}
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
    </div>
  );
};

export default StableRequestsList;
