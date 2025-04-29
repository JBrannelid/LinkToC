import React, { useEffect } from 'react';
import { useNavigate } from "react-router";
import { ROUTES } from "../../routes/index.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";
import CreateStableScreen from "./CreateStableScreen.jsx";
import JoinStableScreen from "./JoinStableScreen.jsx";
import { useStableOnboarding } from "../../hooks/useStableOnboarding";

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

    return (
        <div className="container mx-auto px-4 py-8" role="main" aria-live="polite">
            {/* Conditional rendering based on current step */}
            {currentStep === "welcome" && (
                <WelcomeScreen
                    onCreateStable={handleGoToCreateStable}
                    onJoinStable={handleGoToJoinStable}
                />
            )}

            {currentStep === "create" && (
                <CreateStableScreen
                    formMethods={formMethods}
                    onSubmit={handleStableCreationSuccess}
                    onBack={handleGoBack}
                    isLoading={loading}
                    loadingState={loadingState}
                    message={message}
                    error={error}
                />
            )}

            {currentStep === "join" && (
                <JoinStableScreen
                    onSubmit={handleStableJoinSuccess}
                    onBack={handleGoBack}
                    isLoading={loading}
                    loadingState={loadingState}
                    error={error}
                />
            )}
        </div>
    );
};

export default StableOnboardingContainer;