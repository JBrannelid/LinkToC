
import { ErrorTypes } from "../api/index.js";

// Re-export the error types for convenience
export { ErrorTypes };

// Converts API errors to user-friendly messages based on error type
export function getErrorMessage(error, options = {}) {
    const {
        defaultMessage = 'Något gick fel. Vänligen försök igen.',
        customMessages = {}
    } = options;

    if (!error) {
        return { type: 'error', text: defaultMessage };
    }

    // Check for custom message mappings based on exact message match
    if (error.message && customMessages[error.message]) {
        return { type: 'error', text: customMessages[error.message] };
    }

    // Handle specific error types from your standardized system
    switch (error.type) {
        case ErrorTypes.VALIDATION:
            return {
                type: 'error',
                text: error.message || 'Vänligen kontrollera din inmatning.'
            };
        case ErrorTypes.NETWORK:
            return {
                type: 'error',
                text: 'Nätverksfel. Kontrollera din anslutning.'
            };
        case ErrorTypes.SERVER:
            return {
                type: 'error',
                text: 'Serverfel. Vänligen försök igen senare.'
            };
        case ErrorTypes.AUTH:
            return {
                type: 'error',
                text: 'Autentiseringsfel. Försök eller kontakta support.'
            };
        default:
            // Check for specific password reset scenarios by message content
            if (error.message) {
                if (isResetCodeInvalid(error)) {
                    return {
                        type: 'error',
                        text: 'Ogiltig eller utgången återställningskod.'
                    };
                }
            }

            // Default fallback
            return {
                type: 'error',
                text: error.message || defaultMessage
            };
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