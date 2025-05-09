import {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import stableService from "../api/index";
import {useLoadingState} from "./useLoadingState.js";
import {createErrorMessage, createSuccessMessage} from "../utils/errorUtils.js";

export function useStableJoinRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [operationType, setOperationType] = useState("create");
    const {user} = useAuth();
    
    const loadingState = useLoadingState(loading, operationType);
    
    const sendJoinRequest = async (data) => {
        if(!user || !user.id) {
            setError(createErrorMessage('You need to be logged in to send a join request'));
            return { success: false };  
        }
        if(!data || !data.stableId) {
            setError(createErrorMessage('No stable selected'));
            return { success: false };
        }
        try {
            setLoading(true);
            setOperationType("create");
            setError(null);
            setMessage(null);
            
            const requestData = {
                userId: user.id,
                stableId: data.stableId
            };
            
            const response = await stableService.createStableJoinRequest(requestData);
            
            if(response && (response.isSuccess || response.success)) {
                const successMsg = `You request to join ${data.stableName?.name || 'stable'} has been sent!`;
                setMessage(createSuccessMessage(successMsg));
                return {
                    success: true,
                    message: successMsg
            
                };
            }else {
                const errorMsg = response?.message || 'Failed to send join request';
                setError(createErrorMessage(errorMsg));
                return {
                    success: false,
                    message: errorMsg
                };
            }
        }catch (error) {
            const errorMsg = error?.message || 'An error occurred while sending the join request';
            setError(createErrorMessage(errorMsg));
            return{
                success: false,
                message: errorMsg
            };
        } finally {
            setLoading(false);
        }
    };
    
    const resetState=() => {
        setLoading(false);
        setError(null);
        setMessage(null);
    };
    return {
        loading,
        error,
        message,
        loadingState,
        sendJoinRequest,
        resetState
    };
}
