import React, { useCallback, useState } from "react";
import { FormMessage, FormProvider } from "../forms/index.js";
import searchConfigs from "../search/config/searchConfig.js";
import {
  SearchActions,
  SearchBar,
  SearchProvider,
  SearchResults,
} from "../search/index.js";
import { useStableJoinRequest } from "../../hooks/useStableJoinRequest.js";
import ConfirmationModal from "../ui/ConfirmationModal";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";

const JoinStableForm = ({
  formMethods,
  onSubmit,
  onCancel,
  isLoading: externalLoading = false,
  loadingState: externalLoadingState = null,
  error: externalError = null,
  message: externalMessage = null,
  hideLabel = false,
  inputClassName = "",
  desktopView = false,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStable, setSelectedStable] = useState(null);

  const {
    sendJoinRequest,
    loading: hookLoading,
    error: hookError,
    message: hookMessage,
    loadingState: hookLoadingState,
  } = useStableJoinRequest();
  const isLoading = hookLoading || externalLoading;
  const loadingState = hookLoading ? hookLoadingState : externalLoadingState;
  const error = hookError || externalError;
  const message = hookMessage || externalMessage;

  const stableConfig = {
    ...searchConfigs.stable,
    loading: isLoading,
    loadingState: loadingState,
  };

  // Handle stable selection - open confirmation modal
  const handleStableSelect = useCallback((data) => {
    setSelectedStable(data);
    setShowConfirmModal(true);
  }, []);

  // Handle confirmation - send the join request
  const handleJoinConfirm = useCallback(async () => {
    if (!selectedStable) return;

    const result = await sendJoinRequest(selectedStable);
    console.log("Join request result:", result);

    if (result.success) {
      setShowConfirmModal(false);

      if (onSubmit) {
        setTimeout(() => {
          onSubmit({
            ...selectedStable,
            action: "request",
            requestSent: true,
          });
        }, 1500);
      }
    }
  }, [selectedStable, sendJoinRequest, onSubmit]);

  const handleCancelSearch = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const displayError =
    typeof error === "string" ? { type: "error", text: error } : error;

  const ariaAttributes = {
    "aria-busy": isLoading ? "true" : "false",
  };

  if (isLoading && loadingState) {
    ariaAttributes["aria-live"] = "polite";
  }

  return (
    <FormProvider methods={formMethods} className="w-full">
      <div {...ariaAttributes}>
        {/* The SearchProvider encapsulates all search functionality */}
        <SearchProvider customConfig={stableConfig}>
          <div className="space-y-4">
            {/* Search input */}
            <div>
              {!hideLabel && (
                <label
                  htmlFor="stable-search"
                  className="block text-sm font-medium mb-1"
                >
                  Search for stable
                </label>
              )}
              <SearchBar
                className="w-full"
                inputClassName={`w-full ${inputClassName}`}
                ariaLabel="Search for stable name"
                autoFocus={!desktopView}
                desktopView={desktopView}
                maintainFocus={!desktopView}
                disabled={isLoading}
              />
            </div>

            {isLoading && loadingState && (
              <div className="sr-only" aria-live="polite">
                {loadingState.getMessage() || "Loading..."}
              </div>
            )}

            {/* Search results */}
            <SearchResults
              className="mt-4"
              maxHeight="40vh"
              showWhenEmpty={false}
              onItemSelect={handleStableSelect}
            />

            {/* Error message display */}
            {displayError && <FormMessage message={displayError} />}

            {/* Success message display */}
            {message && message.text && !displayError && (
              <FormMessage message={message} />
            )}

            {/* Action button */}
            <div className="mt-6">
              {!desktopView ? (
                <SearchActions
                  onCancel={handleCancelSearch}
                  loading={isLoading}
                  loadingState={loadingState}
                  disabled={isLoading}
                />
              ) : (
                // Only show search button in desktop view, no cancel button
                <div className="hidden">
                  <SearchActions
                    onCancel={handleCancelSearch}
                    loading={isLoading}
                    loadingState={loadingState}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        </SearchProvider>
      </div>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedStable(null);
        }}
        onConfirm={handleJoinConfirm}
        loading={isLoading}
        title="Request to join stable?"
        confirmButtonText="Send Request"
        confirmButtonType="primary"
        cancelButtonText="Cancel"
        icon={
          <HandRaisedIcon
            size={70}
            backgroundColor="bg-primary"
            iconColor="text-white"
          />
        }
      >
        {selectedStable && (
          <div className="text-center space-y-2">
            <p className="font-medium">{selectedStable.name}</p>
            {selectedStable.type && (
              <p className="text-gray">{selectedStable.type}</p>
            )}
            {selectedStable.county && (
              <p className="text-gray">{selectedStable.county}</p>
            )}
            <p className="text-sm text-gray mt-4">
              The stable administrator will need to approve your request before
              you can access it.
            </p>
          </div>
        )}
      </ConfirmationModal>
    </FormProvider>
  );
};

export default React.memo(JoinStableForm);
