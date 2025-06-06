import { useCallback, useMemo, useState } from "react";
import { useAuth } from "./useAuth.js";
import { useLoadingState } from "./useLoadingState.js";
import stableService from "../api/services/stableService.js";
import {
  createErrorMessage,
  createSuccessMessage,
  createWarningMessage,
    ErrorTypes,
} from "../utils/errorUtils.js";

export function useStableJoinRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [operationType, setOperationType] = useState("create");
  const [lastRequest, setLastRequest] = useState(0);

  const { user } = useAuth();
  const THROTTLE_TIME = 60000;
  const loadingState = useLoadingState(loading, operationType);

  const isThrottled = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequest;
    return timeSinceLastRequest < THROTTLE_TIME;
  }, [lastRequest]);

  const throttleTimeRemaining = useMemo(() => {
    if (!isThrottled()) return 0;
    return Math.ceil((THROTTLE_TIME - (Date.now() - lastRequest)) / 1000);
  }, [isThrottled, lastRequest]);
  const sendJoinRequest = async (data) => {
    if (!user || !user.id) {
      setError(
        createErrorMessage("You need to be logged in to send a join request")
      );
      return { success: false };
    }
    if (!data || !data.stableId) {
      setError(createErrorMessage("No stable selected"));
      return { success: false };
    }
    
    if (isThrottled()) {
      const warningMsg = `Please wait ${throttleTimeRemaining} seconds before sending another join request`;
      setMessage(createWarningMessage(warningMsg));
      return {
        success: false,
        throttled: true,
        timeRemaining: throttleTimeRemaining,
        message: warningMsg,
      };
    }
    setLoading(true);
    setOperationType("create");
    setError(null);
    setMessage(null);
    setLastRequest(Date.now());
    
    const requestData = {
      userId: user.id,
      stableId: data.stableId || data.id,
    }

    try {
        const response = await stableService.createStableJoinRequest(
          requestData
        );

        if (response && (response.isSuccess || response.success)) {
          const stableName =
            data.stableName?.name || data.stableName || "stable";
          const successMsg = `You request to join ${stableName} has been sent!`;
          setMessage(createSuccessMessage(successMsg));
          return {
            success: true,
            message: successMsg,
          };
        }  setError(createErrorMessage("Unexpected response format"));
      return {
        success: false,
        message: "Unexpected response format",
      };
          
        
    } catch (error) {
      if (error.type === ErrorTypes.VALIDATION && error.status === 400) {
        const apiMessage = error.details?.message || error.message || "";
        
        if (
            apiMessage.toLowerCase().includes("already") ||
            apiMessage.toLowerCase().includes("duplicate") ||
            apiMessage.toLowerCase().includes("member")
        ) {
          const warningMsg = `You're already a member of this stable.`;
          setMessage(createWarningMessage(warningMsg));
          return {
            success: false,
            alreadyMember: true,
            message: warningMsg,
          };
        }
        
        setError(createErrorMessage(apiMessage));
        return {
          success: false,
          message: apiMessage,
        };
      }
      
      const errorMsg = error?.message || "An error occurred while sending the join request";
      setError(createErrorMessage(errorMsg));
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      setLoading(false);
    }
  };

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setMessage(null);
  }, []);
  return {
    loading,
    error,
    message,
    loadingState,
    sendJoinRequest,
    resetState,
    isThrottled: isThrottled(),
    throttleTimeRemaining,
  };
}
