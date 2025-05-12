import React, { useCallback } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../routes/index.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";
import { useStableOnboarding } from "../../../hooks/useStableOnboarding";
import { CreateStableForm, JoinStableForm } from "../../forms/index.js";
import OnboardingLayout from "../OnboardingLayout.jsx";
import LoadingSpinner from "../../ui/LoadingSpinner.jsx";
import { useAuth } from "../../../context/AuthContext";
import { useAppContext } from "../../../context/AppContext";
import { useForm } from "react-hook-form";

const StableOnboardingContainer = () => {
  const navigate = useNavigate();
  const { verifyToken } = useAuth();
  const { changeStable } = useAppContext();
  const {
    currentStep,
    isFirstLogin,
    loading,
    error,
    message,
    loadingState,
    formMethods,
    navigateToStep,
    handleCreateStable,
  } = useStableOnboarding();

  // Create a separate form methods for desktop layout to avoid conflicts
  const desktopJoinFormMethods = useForm({
    defaultValues: {
      stableName: "",
      streetAddress: "",
      postCode: "",
      county: "",
      typeOfStable: "",
      stableBoxes: "",
    },
    mode: "onChange",
  });

  const desktopCreateFormMethods = useForm({
    defaultValues: {
      stableName: "",
      streetAddress: "",
      postCode: "",
      county: "",
      typeOfStable: "",
      stableBoxes: "",
    },
    mode: "onChange",
  });

  const handleStableCreationSuccess = async (data) => {
    const result = await handleCreateStable(data);

    if (result.success && result.stable) {
      console.log("Success, refreshing token...");
      await verifyToken();

      sessionStorage.removeItem("isFirstLogin");
      navigate(ROUTES.SELECT_STABLE);
    }
  };

  const handleStableJoinSuccess = useCallback(
    async (data) => {
      // Handle join request (not immediate join)
      if (data.action === "request" && data.requestSent) {
        try {
          // Clear first login flag
          sessionStorage.removeItem("isFirstLogin");

          // Navigate to stable selection page with success message
          navigate(ROUTES.SELECT_STABLE, {
            state: {
              message:
                "Your request to join the stable has been sent. Please wait for approval.",
              type: "success",
              source: "/stable-onboarding",
            },
          });
        } catch (error) {
          console.error("Error handling join request:", error);
        }
      }
    },
    [navigate]
  );

  const handleGoToCreateStable = () => navigateToStep("create");
  const handleGoToJoinStable = () => navigateToStep("join");
  const handleGoBack = () => navigateToStep("welcome");
  const handleBackToSignIn = () => navigate(ROUTES.LOGIN);

  // Render current content based on step for mobile layout
  const renderCurrentStep = () => {
    if (loading) {
      return (
        <OnboardingLayout title="Setting up your account" showImage={false}>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="mb-4">
              <LoadingSpinner size="medium" />
            </div>
            <p className="text-center text-gray">
              {loadingState.getMessage() || "Setting up your new account..."}
            </p>
          </div>
        </OnboardingLayout>
      );
    }
    switch (currentStep) {
      case "welcome":
        return (
          <OnboardingLayout title="EQUILOG" showImage={true}>
            <WelcomeScreen
              onCreateStable={handleGoToCreateStable}
              onJoinStable={handleGoToJoinStable}
            />
          </OnboardingLayout>
        );

      case "create":
        return (
          <OnboardingLayout title="Create new Stable" showImage={false}>
            <CreateStableForm
              formMethods={formMethods}
              onSubmit={handleStableCreationSuccess}
              onCancel={handleGoBack}
              isLoading={loading}
              loadingState={loadingState}
              error={error}
              message={message}
            />
          </OnboardingLayout>
        );

      case "join":
        return (
          <OnboardingLayout title="Join Stable" showImage={false}>
            <JoinStableForm
              formMethods={formMethods}
              onSubmit={handleStableJoinSuccess}
              onCancel={handleGoBack}
              isLoading={loading}
              loadingState={loadingState}
              error={error}
              message={message}
            />
          </OnboardingLayout>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <>
      {/* Mobile layout - keep existing functionality */}
      <div
        className="lg:hidden container mx-auto px-4 py-8"
        role="main"
        aria-live="polite"
      >
        {renderCurrentStep()}
      </div>

      {/* Desktop layout - new split design */}
      <div className="hidden lg:flex h-screen">
        {/* Left side - Join existing stable */}
        <div className="w-1/2 bg-background p-8 overflow-y-auto flex flex-col items-center">
          <div className="max-w-md w-full mt-16">
            <h2 className="text-3xl mb-10 text-center">Join a stable</h2>
            <div className="mb-10">
              <JoinStableForm
                formMethods={desktopJoinFormMethods}
                onSubmit={handleStableJoinSuccess}
                onCancel={null}
                isLoading={loading}
                loadingState={loadingState}
                error={error}
                message={message}
                hideLabel={true}
                inputClassName="!bg-white"
                desktopView={true}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray"></div>
              <span className="px-4 text-gray">Or</span>
              <div className="flex-1 border-t border-gray"></div>
            </div>

            {/* Sign in link */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <span className="text-sm text-gray">Go back to</span>
              <button
                type="button"
                className="text-sm font-semibold text-primary hover:underline focus:outline-none"
                onClick={handleBackToSignIn}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Create new stable */}
        <div className="w-1/2 bg-white p-1 overflow-y-auto flex flex-col items-center">
          <div className="max-w-md w-full mt-16">
            <h2 className="text-3xl mb-8 text-center">Create a stable</h2>
            <div className="max-h-8/12">
              <CreateStableForm
                formMethods={desktopCreateFormMethods}
                onSubmit={handleStableCreationSuccess}
                onCancel={null}
                isLoading={loading}
                loadingState={loadingState}
                error={error}
                message={message}
                desktopView={true}
                hideLabel={true}
                inputClassName=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StableOnboardingContainer;
