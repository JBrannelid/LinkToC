import React from "react";
import StableOnboardingContainer from "../components/stableOnboarding/StableOnboardingContainer";

const StableOnboardingPage = () => {
    return (
        <div className="min-h-screen bg-black py-4">
            <div className="mx-auto max-w-md bg-white">
                <StableOnboardingContainer />
            </div>
        </div>
    );
};

export default StableOnboardingPage;