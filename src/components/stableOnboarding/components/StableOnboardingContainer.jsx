import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../routes/index.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";
import { useStableOnboarding } from "../../../hooks/useStableOnboarding";
import { CreateStableForm, JoinStableForm } from "../../forms/index.js";
import OnboardingLayout from "../OnboardingLayout.jsx";
import LoadingSpinner from "../../ui/LoadingSpinner.jsx";

const StableOnboardingContainer = () => {
  const navigate = useNavigate();

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
    handleJoinStable,
  } = useStableOnboarding();

  useEffect(() => {
    if (!isFirstLogin) {
      navigate(ROUTES.HOME);
    }
  }, [isFirstLogin, navigate]);

  const handleStableCreationSuccess = async (data) => {
    const result = await handleCreateStable(data);

    if (result.success) {
      sessionStorage.removeItem("isFirstLogin");
      navigate(ROUTES.HOME);
    }
  };

  const handleStableJoinSuccess = useCallback(
    async (data) => {
      if (data.action === "join" && data.stableId) {
        try {
          const stableName =
            typeof data.stableName === "object"
              ? data.stableName.name
              : data.stableName;

          const result = await handleJoinStable(data.stableId, stableName);

          if (result.success) {
            sessionStorage.removeItem("isFirstLogin");
            navigate(ROUTES.HOME);
          }
        } catch (error) {
          console.error("Error updating stable state:", error);
        }
      }
    },
    [handleJoinStable, navigate]
  );

  const handleGoToCreateStable = () => navigateToStep("create");
  const handleGoToJoinStable = () => navigateToStep("join");
  const handleGoBack = () => navigateToStep("welcome");

  const renderCurrentStep = () => {
    if (loading) {
      return (
        <OnboardingLayout title="Setting up your account" showImage={false}>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="mb-4">
              <LoadingSpinner size="medium" />
            </div>
            <p className="text-center text-gray-600">
              {loadingState.getMessage() || "Setting up your new account..."}
            </p>
          </div>
        </OnboardingLayout>
      );
    }
    switch (currentStep) {
      case "welcome":
        return (
          <OnboardingLayout title="EQUILOQ" showImage={true}>
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
    <div className="container mx-auto px-4 py-8" role="main" aria-live="polite">
      {renderCurrentStep()}
    </div>
  );
};

export default StableOnboardingContainer;
