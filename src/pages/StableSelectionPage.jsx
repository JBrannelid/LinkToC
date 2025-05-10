import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useUserStables } from "../hooks/useUserStables";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routeConstants";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Card from "../components/ui/card";
import Button from "../components/ui/Button";
import ModalHeader from "../components/layout/ModalHeader";
import StableIcon from "../assets/icons/StableIcon";
import { CreateStableForm, JoinStableForm } from "../components/forms";
import { useStableOnboarding } from "../hooks/useStableOnboarding";
import { createSuccessMessage } from "../utils/errorUtils";
import FormMessage from "../components/forms/formBuilder/FormMessage";

const StableSelectionPage = () => {
  const { changeStable } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    stables,
    loading: stablesLoading,
    error,
    loadingState: stablesLoadingState,
  } = useUserStables();

  const [currentView, setCurrentView] = useState(null);
  const [pageMessage, setPageMessage] = useState(null);

  // Ref for scrolling
  const exploreButtonsRef = useRef(null);

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

  const handleSelectStable = (stable) => {
    changeStable(stable.id, stable.name);
    navigate(ROUTES.HOME);
  };

  // Handle successful stable creation
  const handleStableCreationSuccess = async (data) => {
    const result = await handleCreateStable(data);
    if (result.success) {
      sessionStorage.removeItem("isFirstLogin");
      navigate(ROUTES.HOME);
    }
  };

  const handleCancel = () => {
    setCurrentView(null);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stables.map((stable) => (
              <Card.Container
                key={stable.id}
                className="cursor-pointer"
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
                </Card.Body>
              </Card.Container>
            ))}
          </div>
        ) : (
          // No stables available - display message
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <StableIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              You don't have any stables yet
            </h3>
            <p className=" md:mb-6">
              Create a new stable or wait for an invitation
            </p>
          </div>
        )}

        {/* Action buttom  */}
        <div
          ref={exploreButtonsRef}
          className="mt-10 md:mt-0 max-w-md mx-auto "
        >
          {/* Show buttons if no form is selected */}
          {currentView === null && (
            <div>
              <h3 className="text-lg text-center mb-6">Explore new stables</h3>
              <div className="space-y-3 flex flex-col justify-center  items-center">
                <Button
                  type="primary"
                  className="w-9/10"
                  onClick={() => setCurrentView("create")}
                >
                  New stable
                </Button>

                <Button
                  type="secondary"
                  className="w-9/10"
                  onClick={() => setCurrentView("join")}
                >
                  Search for existing stable
                </Button>
              </div>
            </div>
          )}

          {/* Show Create Form */}
          {currentView === "create" && (
            <CreateStableForm
              formMethods={formMethods}
              onSubmit={handleStableCreationSuccess}
              onCancel={handleCancel}
              isLoading={loading}
              loadingState={loadingState}
              error={onboardingError}
              message={message}
            />
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
