
import { ErrorTypes } from "../api/index.js";
import { extractReadableErrorMessage } from "../api/utils/errors.js";

// Re-export the error types for convenience
export { ErrorTypes };

const ERROR_MESSAGES = {
    // Auth errors
    'AUTH_401': 'Invalid email or password.',
    'AUTH_403': 'You are not authorized to perform this action.',

    // Not found errors
    'NOT_FOUND_404': 'The requested resource was not found.',

    // Server errors
    'SERVER_500': 'An internal server error occurred. Please try again later.',
    'SERVER_502': 'The server is temporarily unavailable. Please try again later.',
    'SERVER_503': 'Service unavailable. Please try again later.',
    'SERVER_504': 'The server took too long to respond. Please try again later.',

    // Network errors
    'NETWORK_ERROR': 'Could not connect to the server. Please check your internet connection.',

    // Validation errors are handled separately with field-specific messages

    // Default fallbacks
    'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.'
};
// Converts API errors to user-friendly messages based on error type
export function getErrorMessage(error, options = {}) {
    const {
        defaultMessage = 'Something went wrong. Please try again later.',
        customMessages = {}
    } = options;

    if (!error) {
        return { type: 'error', text: defaultMessage };
    }

    // Check for custom message mappings based on exact message match
    if (error.message && customMessages[error.message]) {
        return { type: 'error', text: customMessages[error.message] };
    }

   if(error.type === ErrorTypes.VALIDATION && error.details) {
       const validationMessage = extractReadableErrorMessage(error.details);
       return { type: 'error', text: validationMessage };
   }
   
   if(error.message && ERROR_MESSAGES[error.message]) {
       return { type: 'error', text: ERROR_MESSAGES[error.message] };
   }
    if (error.type === ErrorTypes.AUTH) {
        return { type: 'error', text: 'Authentication error. Please try again or contact support.' };
    } else if (error.type === ErrorTypes.NETWORK) {
        return { type: 'error', text: 'Network error. Please check your connection.' };
    } else if (error.type === ErrorTypes.SERVER) {
        return { type: 'error', text: 'Server error. Please try again later.' };
    }
}

// Checks if an error is related to invalid or expired reset code
export function isResetCodeInvalid(error) {
    if (!error || !error.message) return false;

    const lowerMessage = error.message.toLowerCase();
    return lowerMessage.includes("does not exist") ||
        lowerMessage.includes("expired") ||
        lowerMessage.includes("invalid") ||
        lowerMessage.includes("utgången");
}

// Determines if the UI should show the "not found" state for reset codes
export function shouldShowResetCodeNotFound(message, notFoundFlag) {
    if (notFoundFlag) return true;

    if (message?.type === 'error' && message?.text) {
        return isResetCodeInvalid({ message: message.text });
    }

    return false;
}

// Create a success message object
export function createSuccessMessage(text) {
    return { type: 'success', text };
}

// Create a warning message object
export function createWarningMessage(text) {
    return { type: 'warning', text };
}

// Create an error message object
export function createErrorMessage(text) {
    return { type: 'error', text };
}