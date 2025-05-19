import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useUserStables } from "../hooks/useUserStables";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/index.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Card from "../components/ui/card";
import Button from "../components/ui/Button";
import ModalHeader from "../components/layout/ModalHeader";
import StableIcon from "../assets/icons/StableIcon";
import { CreateStableForm, JoinStableForm } from "../components/forms";
import { useStableOnboarding } from "../hooks/useStableOnboarding";
import { createSuccessMessage } from "../utils/errorUtils";
import FormMessage from "../components/forms/formBuilder/FormMessage";
import {USER_ROLES} from "../utils/userUtils.js";
import HandRaisedIcon from "../assets/icons/HandRaisedIcon.jsx";
import ConfirmationModal from "../components/ui/ConfirmationModal.jsx";
import useStableData from "../hooks/useStableData.js";
import useScrollToElement from "../hooks/useScrollToElement.js";

const StableSelectionPage = () => {
  const { changeStable } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    stables,
    loading: stablesLoading,
    error,
    loadingState: stablesLoadingState,
      refetch: refetchUserStables,
  } = useUserStables();

  const { deleteStable, leaveStable } = useStableData();
  const messageTimeoutRef = useRef(null);
  const [currentView, setCurrentView] = useState(null);
  const [pageMessage, setPageMessage] = useState(null);
  const { elementRef: formSectionRef, scrollIntoView } = useScrollToElement();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionConfirmation, setActionConfirmation] = useState({
    isOpen: false,
    stable: null,
    action: null // 'delete' or 'leave'
  });

  const handleStableAction = async () => {
    const { stable, action } = actionConfirmation;
    if (!stable || !action) return;

    try {
      setIsProcessing(true);
      let success = false;

      // Handle different actions using the hook methods
      if (action === 'delete') {
        success = await deleteStable(stable.id);
      } else if (action === 'leave') {
        // Use leaveStable from useStableData instead of direct API call
        success = await leaveStable(stable.id);
      }

      if (success) {
        // Show success message
        if (messageTimeoutRef.current) {
          clearTimeout(messageTimeoutRef.current);
        }
        setPageMessage(createSuccessMessage(
            action === 'delete'
                ? `Stable "${stable.name}" was successfully deleted.`
                : `You have successfully left "${stable.name}".`
        ));
        messageTimeoutRef.current = setTimeout(() => {
          setPageMessage(null);
          messageTimeoutRef.current = null;
        }, 3000);
        // Refresh the stables list
        await refetchUserStables();
      }
    } catch (err) {
      console.error(`Error ${actionConfirmation.action} stable:`, err);
      setPageMessage({
        type: "error",
        text: err.message || `Failed to ${actionConfirmation.action} stable`
      });
    } finally {
      setIsProcessing(false);
      closeConfirmation();
    }
  };
  
  //Deconstruct onboarding hook
  const {
    loading,
    error: onboardingError,
    message,
    loadingState,
    formMethods,
    handleCreateStable,
  } = useStableOnboarding();

  // Add useEffect to handle messages from navigation
  useEffect(() => {
    if (location.state?.message) {
      setPageMessage(createSuccessMessage(location.state.message));

      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setPageMessage(null);
      }, 5000);

      // Clear location state to prevent message from showing again on refresh
      navigate(location.pathname, { replace: true, state: {} });

      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  // Open confirmation modal
  const openConfirmation = (stable, action, e) => {
    e.stopPropagation(); // Prevent card click
    setActionConfirmation({
      isOpen: true,
      stable,
      action
    });
  };

  // Close confirmation modal
  const closeConfirmation = () => {
    setActionConfirmation({
      isOpen: false,
      stable: null,
      action: null
    });
  };
  const handleSelectStable = (stable) => {
    // Check if this might be a newly created stable
    const newStableCreated = sessionStorage.getItem("newStableCreated");

    if (newStableCreated === "true") {
      // The changeStable function will handle the bypass internally
    }

    const success = changeStable(stable.id, stable.name);

    if (success) {
      navigate(ROUTES.HOME);
    }
  };

  // Handle successful stable creation
  const handleStableCreationSuccess = async (data) => {
    const result = await handleCreateStable(data);

    if (result.success && result.stable) {
      console.log(
        "Stable created successfully. Setting bypass flag and redirecting..."
      );

      // Clear first-time flag
      sessionStorage.removeItem("isFirstLogin");

      // Set flag for newly created stable to bypass security check
      sessionStorage.setItem("newStableCreated", "true");

      // Force a page reload to the select-stable page
      window.location.href = "/select-stable";
    }
  };

  const handleCancel = () => {
    setCurrentView(null);
  };
  const handleNewStableClick = () => {
    setCurrentView("create");
    
    setTimeout(() => {
      scrollIntoView({
        setFocus: true,
        block: 'start',
        behavior: 'smooth',
        delay: 50, 
        focusSelector: 'input[name="stableName"]' 
      });
    }, 10); 
  };

  if (stablesLoading) {
    return (
      <div className=" bg-background flex flex-col items-center justify-center">
        <LoadingSpinner size="large" className="text-primary mb-4" />
        <p className="text-gray-600">{stablesLoadingState.getMessage()}</p>
      </div>
    );
  }

  const userFullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : "Unknown User";
  const getConfirmationProps = () => {
    const { stable, action } = actionConfirmation;

    if (action === 'delete') {
      return {
        title: `Delete stable "${stable?.name || ''}"?`,
        confirmText: "Delete",
        buttonType: "danger",
        iconBg: "bg-error-500",
        message: "This action cannot be undone. All data associated with this stable will be permanently deleted."
      };
    } else if (action === 'leave') {
      return {
        title: `Leave stable "${stable?.name || ''}"?`,
        confirmText: "Leave",
        buttonType: "warning",
        iconBg: "bg-warning-500",
        message: "Are you sure you want to leave this stable? You'll need to send another invite to join the stable again."
      };
    }

    return {}; 
  };

  const confirmProps = getConfirmationProps();

  return (
    <div className="flex flex-col bg-background pb-20 lg:pb-0 overflow-y-auto">
      {/* Header */}
      <div className="bg-primary-light lg:bg-background lg:hidden">
        <ModalHeader title="Select Stable" showCloseBtn={false} />
      </div>

      <div className="px-4 py-4 mx-auto md:pt-10 lg:pt-15">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl mb-2">Welcome {userFullName}!</h2>
          <p className="text-gray pt-5">
            Choose a stable to work with today, explore new ones, or{" "}
            <span
              className="text-primary cursor-pointer hover:underline font-semibold"
              onClick={() => navigate(ROUTES.STABLE_REQUESTS)}
            >
              check your pending requests
            </span>
          </p>
        </div>

        {pageMessage && (
          <div className="mb-6 max-w-md mx-auto">
            <FormMessage message={pageMessage} />
          </div>
        )}

        {/* Stables grid from card grid container */}
        {stables.length > 0 ? (
          <div className="grid justify-items-center grid-cols-1 md:grid-cols-2 gap-6 mb-10 md:mb-20 mt-10">
            {stables.map((stable) => (
              <Card.Container
                key={stable.id}
                className="cursor-pointer w-full"
                onClick={() => handleSelectStable(stable)}
              >
                <Card.Body className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mr-4">
                      <StableIcon className="w-8 h-8 text-primary" />
                    </div>
                    {/* Stable name and typ headings */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {stable.name || "Unknown stable name"}{" "}
                      </h3>
                      <p className="text-sm ">
                        {stable.type || "Unknown stable type"}
                      </p>
                    </div>
                  </div>

                  {/* Role and stable county */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Your role:</span>
                      <span className="font-medium text-primary">
                        {getRoleName(stable.userRole)}
                      </span>
                    </div>
                    {stable.county && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stable county:</span>
                        <span className="font-medium">{stable.county}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-center items-center gap-2">
                    <Button
                        type="primary"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectStable(stable);
                        }}
                    >
                      Select this stable
                    </Button>

                    {stable.userRole !== USER_ROLES.MANAGER && (
                        <Button
                            type="warning"
                            className="w-full mt-2"
                            onClick={(e) => openConfirmation(stable,'leave', e)}
                            disabled={isProcessing}
                        >
                          Leave stable
                        </Button>
                    )}
                    {stable.userRole === USER_ROLES.MANAGER && (
                        <Button
                            type="danger"
                            className="w-full mt-2"
                            onClick={(e) => openConfirmation(stable,'delete', e)}
                            disabled={isProcessing}
                        >
                          Delete stable
                        </Button>
                    )}
                  </div>
                </Card.Body>
              </Card.Container>
            ))}
          </div>
        ) : (
          // No stables available - display message
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto">
              <StableIcon className="w-10 h-10 text-primary" />
            </div>
          </div>
        )}

        {/* Action button  */}
        <div className="mt-10 md:mt-0 max-w-md mx-auto">
          {/* Show buttons if no form is selected */}
          {currentView === null && (
            <div>
              <h3 className="text-lg text-center mb-6">Explore new stables</h3>
              <div className="space-y-3 flex flex-col justify-center items-center">
                <Button
                  type="primary"
                  className="w-9/10 max-w-md"
                  onClick={handleNewStableClick} 
                  aria-controls="create-stable-form"
                  aria-expanded={currentView === "create"}
                >
                  New stable
                </Button>

                <Button
                  type="secondary"
                  className="w-9/10 max-w-md"
                  onClick={() => setCurrentView("join")}
                >
                  Search for existing stable
                </Button>
              </div>
            </div>
          )}

          {/* Show Create Form */}
          {currentView === "create" && (
              
              <div
              ref={formSectionRef}
              id="create-stable-form"
              aria-labelledby="create-stable-heading">
                <CreateStableForm
                    formMethods={formMethods}
                    onSubmit={handleStableCreationSuccess}
                    onCancel={handleCancel}
                    isLoading={loading}
                    loadingState={loadingState}
                    error={onboardingError}
                    message={message}
                />
              </div>
          )}

          {/* Show Join Form */}
          {currentView === "join" && (
            <JoinStableForm
              formMethods={formMethods}
              onCancel={handleCancel}
              isLoading={loading}
              loadingState={loadingState}
              error={onboardingError}
              message={message}
            />
          )}
        </div>
      </div>
      <ConfirmationModal
          isOpen={actionConfirmation.isOpen}
          onClose={closeConfirmation}
          onConfirm={handleStableAction}
          loading={isProcessing}
          title={confirmProps.title || ""}
          confirmButtonText={confirmProps.confirmText || "Confirm"}
          confirmButtonType={confirmProps.buttonType || "primary"}
          icon={
            <HandRaisedIcon
                size={70}
                backgroundColor={confirmProps.iconBg || "bg-primary"}
                iconColor="text-red-500"
            />
          }
      >
        <p className="text-center mb-4">
          {confirmProps.message || "Are you sure you want to perform this action?"}
        </p>
      </ConfirmationModal>
    </div>
  );
};

// Helper function to get role name
const getRoleName = (role) => {
  switch (role) {
    case 0:
      return "Owner";
    case 1:
      return "Admin";
    case 2:
      return "Member";
    default:
      return "Member";
  }
};

export default StableSelectionPage;
