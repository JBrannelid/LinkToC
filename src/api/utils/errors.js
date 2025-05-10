// Standardized errortypes for consist usage
export const ErrorTypes = {
  VALIDATION: "validation",
  NETWORK: "network",
  SERVER: "server",
  AUTH: "auth",
  UNKNOWN: "unknown",
  NOT_FOUND: "Not Found",
};

function extractReadableErrorMessage(errorData){
  if (typeof errorData === 'string') {
    const missingPropsMatch = errorData.match(/missing required properties, including the following: ([^.]+)/i);
    if(missingPropsMatch && missingPropsMatch[1]){
      return `Missing required fields: ${missingPropsMatch[1]}`;
    }
    
    const typeConversionMatch = errorData.match(/The JSON value could not be converted to .+\. Path: \$\.(\w+)/i);
    if (typeConversionMatch && typeConversionMatch[1]) {
      return `Invalid value for field: ${typeConversionMatch[1]}`;
    }
    
    if(errorData.includes('Failed to read parameter')){
      return 'Invalid request format. Please check your input data.';
    }
  }
  
  if(errorData && typeof errorData === 'object') {
    const errorMessages = [];

    for (const field in errorData.errors) {
      const errors = errorData.errors[field];
      if (Array.isArray(errors) && errors.length > 0) {
        errorMessages.push(`${field}: ${errors[0]}`);
      }
    }

    if (errorMessages.length > 0) {
      return errorMessages.join(', ');
    }

    if (errorData.message) {
      return errorData.message;
    }
  }
  
  try {
    const stringfield = JSON.stringify(errorData);
    if(stringfield.length < 100){
      return stringfield;
    }
  } catch (e){
  }
  
  return 'An error occurred with your request. Please check your input and try again.';
}

export function createError(message, type = ErrorTypes.UNKNOWN, status = 0, details = null) {
  const error = new Error(message);
  error.type = type;
  error.status = status;
  error.details = details;
  return error;
}

// Handle Axios specific errors and convert them to standardized format
export function handleAxiosError(error) {
  // Server responded with an error
  if (error.response) {
    const { status, data } = error.response;
    let exception = ErrorTypes.UNKNOWN;
    
    if (status === 404 &&
        data &&
        typeof data.message === 'string' &&
        data.message.includes('not connected to any stables')) {
      // This is an expected condition for new users, not an error
      return {
        isSuccess: false,
        statusCode: status,
        value: [],
        message: "User has no stables yet"
      };
    }
    
    if (status === 401 || status === 403) {
      exception = ErrorTypes.AUTH;
    } else if (status >= 500) {
      exception = ErrorTypes.SERVER;
    } else if (status === 400) {
      exception = ErrorTypes.VALIDATION;
    } else if (status === 404) {
      exception = ErrorTypes.NOT_FOUND;
    }
    console.log('Full error response:', {
      status,
      data,
      headers: error.response.headers
    });
    
    let readableMessage;
    if (status === 400 && data) {
      readableMessage = extractReadableErrorMessage(data);
    } else {
      readableMessage = data?.message || "An error occured";
    }
    
    return createError(readableMessage, exception, status, data);
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
