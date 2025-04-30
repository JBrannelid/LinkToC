import React, { useEffect } from 'react';
import { useNavigate } from "react-router";
import { ROUTES } from "../../routes/index.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";
import JoinStableScreen from "./JoinStableScreen.jsx";
import { useStableOnboarding } from "../../hooks/useStableOnboarding";
import {CreateStableForm} from "../forms/index.js";
import OnboardingLayout from "../OnboardingLayout.jsx";

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
        handleSearchStable,
        handleJoinStable
    } = useStableOnboarding();

    useEffect(() => {
        if (!isFirstLogin) {
            navigate(ROUTES.HOME);
        }
    }, [isFirstLogin, navigate]);

 
    const handleStableCreationSuccess = async (data) => {
        const result = await handleCreateStable(data);

        if (result.success) {
            sessionStorage.removeItem('isFirstLogin');
            navigate(ROUTES.HOME);
        }
        
    };
    
    const handleStableJoinSuccess = async (data) => {
        if (data.action === 'join' && data.stableId) {
            const result = await handleJoinStable(data.stableId, data.stableName);

            if (result.success) {
                // Navigate to home page on success
                navigate(ROUTES.HOME);
            }
        } else {
            // This is just a search action
            return await handleSearchStable(data);
        }
    };

   
    const handleGoToCreateStable = () => navigateToStep("create");
    const handleGoToJoinStable = () => navigateToStep("join");
    const handleGoBack = () => navigateToStep("welcome");

    const renderCurrentStep = () => {
        switch (currentStep) {
            case "welcome":
                return (
                    <OnboardingLayout title="EQUILOQ">
                        <WelcomeScreen
                            onCreateStable={handleGoToCreateStable}
                            onJoinStable={handleGoToJoinStable}
                        />
                    </OnboardingLayout>
                );

            case "create":
                return (
                    <OnboardingLayout title "Create new Stable">
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
                    <OnboardingLayout title="Join Stable">
                        <JoinStableScreen
                            onSubmit={handleStableJoinSuccess}
                            onBack={handleGoBack}
                            isLoading={loading}
                            loadingState={loadingState}
                            error={error}
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