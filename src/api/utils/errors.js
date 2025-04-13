// Standardized errortypes for consist usage
export const ErrorTypes = {
  VALIDATION: "validation",
  NETWORK: "network",
  SERVER: "server",
  AUTH: "auth",
  UNKNOWN: "unknown",
};

// Standardized error object
export function createError(message, type = ErrorTypes.UNKNOWN, status = 0) {
  const error = new Error(message);
  error.type = type;
  error.status = status;
  return error;
}

// Handle Axios specific errors and convert them to standardized format
export function handleAxiosError(error) {
  // Server responded with an error
  if (error.response) {
    const { status, data } = error.response;
    let exception = ErrorTypes.UNKNOWN;

    if (status === 401 || status === 403) {
      exception = ErrorTypes.AUTH;
    } else if (status >= 500) {
      exception = ErrorTypes.SERVER;
    } else if (status === 400) {
      exception = ErrorTypes.VALIDATION;
    }
    return createError(data?.message || "An error occored", exception, status);
  }

  // The request was made but no response was received (network error)
  if (error.request) {
    return createError(
      "Could not connect to the server",
      ErrorTypes.NETWORK,
      0 // No connection code
    );
  }

  // Error in request configuration
  return createError(
    error.message || "Request configuration error",
    ErrorTypes.UNKNOWN,
    0
  );
}
