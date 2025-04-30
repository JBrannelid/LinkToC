import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { stableService } from "../api";
import { getErrorMessage } from "../utils/errorUtils";
import { useLoadingState } from "./useLoadingState";
import { useForm } from "react-hook-form";

export const useStableOnboarding = () => {
    const {user} = useAuth();
    const { changeStable} = useAppContext();
    
    const formMethods = useForm({
        defaultValues:{
            stableName: "",
            streetAddress: "",
            postCode: "",
            county: "",
            typeOfStable: "Private Stable",
            stableBoxes: ""
        },
        mode: "onChange"
    });
    const [currentStep, setCurrentStep] = useState("welcome");
    const [loading, setLoading] = useState(false);
    const [operationType, setOperationType] = useState("create");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isFirstLogin, setIsFirstLogin] = useState(true);

    useEffect(() => {
        
        const checkFirstLogin = async () => {
            try {
                
                const isFirstLoginFlag = sessionStorage.getItem('isFirstLogin') === 'true';

                if (isFirstLoginFlag) {
                    setIsFirstLogin(true);
                    return;
                }
                
                const userStables = await stableService.getUserStables();
                setIsFirstLogin(userStables.length === 0);
            } catch (error) {
                console.error("Error checking first login status:", error);
                setIsFirstLogin(true);
            }
        };

        if (user?.id) {
            checkFirstLogin();
        }
    }, [user]);
    useEffect(() => {
        setError(null);
        setMessage({ type: "", text: "" });
    }, [currentStep]);
    
    const navigateToStep = useCallback((step) => {
        setCurrentStep(step);
        setError(null);
        setMessage({ type: "", text: "" });
    }, []);

    const handleCreateStable = useCallback(async (formData) => {
        if (!formData.stableName || !formData.stableName.trim())  {
            setMessage({
                type: "error",
                text: "Stable Name is required",
            });
            return { success: false };
        }
        setLoading(true);
        setOperationType("create");
        setError(null);
        setMessage({ type: "", text: "" });

        try {
            
            const stableData = {
                name: formData.stableName.trim(),
                streetAddress: formData.streetAddress,
                postCode: formData.postCode,
                county: formData.county,
                typeOfStable: formData.typeOfStable,
                stableBoxes: parseInt(formData.stableBoxes, 10) || 0
            };
            
            const response = await stableService.createWithWallPost(stableData);

            if (response && response.isSuccess) {

                const tempStableData = {
                    id: 'pending', 
                    name: formData.stableName.trim()
                };
                localStorage.setItem('currentStable', JSON.stringify(tempStableData));
                changeStable('pending', formData.stableName.trim());
                setMessage({
                    type: "success",
                    text: response.message || "Stable created successfully."
                });
                
                return { success: true, message: response.message };
            } else {
                
                const errorMessage = getErrorMessage({
                    type: "server",
                    message: response?.message || "Kunde inte skapa stall"
                }).text;

                setError(errorMessage);
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            
            const errorMessage = getErrorMessage(error, {
                defaultMessage: "Ett fel inträffade vid skapandet av stallet"
            }).text;

            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [changeStable]);

    const handleSearchStable = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setError(getErrorMessage({
                type: "validation",
                message: "Sökfältet får inte vara tomt"
            }).text);
            return { success: false };
        }

        setLoading(true);
        setOperationType("fetch");
        setError(null);

        try {
            // This would be replaced with the actual search implementation
            // For now just simulating an unimplemented feature
            setError(getErrorMessage({
                type: "server",
                message: "search function is not yet implemented"
            }).text);
            return { success: false, error: "Not implemented" };
        } catch (err) {
            setError(getErrorMessage(err).text);
            return { success: false, error: getErrorMessage(err).text };
        } finally {
            setLoading(false);
        }
    }, []);
    
    const handleJoinStable = useCallback(async (stableId, stableName) => {
        if (!stableId) {
            setError("Invalid stable selection");
            return { success: false };
        }

        setLoading(true);
        setOperationType("update");
        setError(null);

        try {
            
            changeStable(stableId, stableName);
            return { success: true };
        } catch (err) {
            setError(getErrorMessage(err).text);
            return { success: false, error: getErrorMessage(err).text };
        } finally {
            setLoading(false);
        }
    }, [changeStable]);

    const loadingState = useLoadingState(loading, operationType);
    return {
       
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
        handleJoinStable,

        
        submitStableForm: (data) => handleCreateStable(data)
    };
};
export default useStableOnboarding;
