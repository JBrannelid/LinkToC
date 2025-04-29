import React, {useState} from 'react';
import { useNavigate} from "react-router";
import { useAppContext} from "../../context/AppContext.jsx";
import { ROUTES } from "../../routes/index.jsx";
import WelcomePage from "";
import CreateStablePage from "";
import JoinStablePage from "";
import {stableService} from "../../api/index.js";
import { getErrorMessage} from "../../utils/errorUtils.js";
import { useLoadingState } from "../../hooks/useLoadingState.jsx";
import SettingIcon from "../../assets/icons/SettingIcon.jsx";

const StableOnboardingContainer = () => {
    const navigate = useNavigate();
    const {changeStable} = useAppContext();

    const [currentStep, setCurrentStep] = useState("welcome");
    const [stableName, setStableName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [operationType, setOperationType] = useState("create");

    const loadingState = useLoadingState(loading, operationType);

    const handleGoToCreateStable = () => {
      setCurrentStep("create");
      setError(null);
    };
    
    const handleGoToJoinStable = () => {
        setCurrentStep("join");
        setError(null);
    };
    const handleGoBack = () => {
        setCurrentStep("welcome");
        setError(null);
    };
    
    const handleStableNameChange = (event) => {
        setStableName(event.target.value);
    };
    
    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    }
    
    const handleCreateStable = async () => {
        if (!stableName.trim()) {
            setError(getErrorMessage({
                type: "validation",
                message: "Stable name is required",
            }).text);
            return;
        }
        setLoading(true);
        setOperationType("create");
        setError(null);


        try {
            // Call the composition endpoint to create both stable and wall post
            const response = await stableService.createWithWallPost({ name: stableName.trim() });

            if (response && (response.isSuccess || response.statusCode === 200 || response.statusCode === 201)) {
                // Extract stable data from response
                const stableData = response.value?.stableDto;

                // Update app context with the new stable
                changeStable(stableData.id, stableData.name);

                // Navigate to home page
                navigate(ROUTES.HOME);
            } else {
                setError(getErrorMessage({
                    type: "server",
                    message: response?.message || "Kunde inte skapa stall"
                }).text);
            }
        } catch (err) {
            setError(getErrorMessage(err, {
                defaultMessage: "Ett fel inträffade vid skapandet av stallet"
            }).text);
        } finally {
            setLoading(false);
        }
    };
    const handleSearchStable = async () => {
        if (!searchQuery.trim()) {
            setError(getErrorMessage({
                type: "validation",
                message: "Sökfältet får inte vara tomt"
            }).text);
            return;
        }

        setLoading(true);
        setOperationType("fetch");
        setError(null);

        try {
            // This would be replaced with the actual search implementation
            setError(getErrorMessage({
                type: "server",
                message: "Sökfunktionen är inte implementerad ännu"
            }).text);
        } catch (err) {
            setError(getErrorMessage(err).text);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black py-4">
            <div className="mx-auto max-w-md bg-white p-4 min-h-[90vh]">
                {/* Settings icon at the top-left corner of all screens */}
                <div className="mb-4">
                    <SettingIcon strokeWidth={9} className="w-7 h-7 text-primary" />
                </div>

                {/* Render current screen */}
                {currentStep === "welcome" && (
                    <WelcomePage
                        onCreateStable={handleGoToCreateStable}
                        onJoinStable={handleGoToJoinStable}
                    />
                )}

                {currentStep === "create" && (
                    <CreateStablePage
                        stableName={stableName}
                        onStableNameChange={handleStableNameChange}
                        onSubmit={handleCreateStable}
                        onBack={handleGoBack}
                        isLoading={loading}
                        loadingState={loadingState}
                        error={error}
                    />
                )}

                {currentStep === "join" && (
                    <JoinStablePage
                        searchQuery={searchQuery}
                        onSearchQueryChange={handleSearchQueryChange}
                        onSubmit={handleSearchStable}
                        onBack={handleGoBack}
                        isLoading={loading}
                        loadingState={loadingState}
                        error={error}
                    />
                )}
            </div>
        </div>
    );
};

export default StableOnboardingContainer;
