export const createResponseHandler = (options = {}) => {
    // Extract options with defaults
    const {
        dataPath = 'data',        
        successPath = 'success',  
        messagePath = 'message',  
        alternativeSuccessPath = 'isSuccess', 
        alternativeDataPath = 'value', 
    } = options;

    return (response) => {
        // Handle empty response
        if (!response) {
            return {
                success: false,
                data: [],
                message: 'No response from server'
            };
        }

        // Handle array response (direct data)
        if (Array.isArray(response)) {
            return {
                success: true,
                data: response,
                message: 'Search completed'
            };
        }

        // Handle standard success/data response
        if (response[successPath] !== undefined) {
            if (!response[successPath]) {
                return {
                    success: false,
                    data: [],
                    message: response[messagePath] || 'Search failed'
                };
            }

            return {
                success: true,
                data: response[dataPath] || [],
                message: response[messagePath] || 'Search completed'
            };
        }

        // Handle alternative success/data format
        if (response[alternativeSuccessPath] !== undefined) {
            if (!response[alternativeSuccessPath]) {
                return {
                    success: false,
                    data: [],
                    message: response[messagePath] || 'Search failed'
                };
            }

            return {
                success: true,
                data: response[alternativeDataPath] || [],
                message: response[messagePath] || 'Search completed'
            };
        }

        // Handle unexpected response format
        console.warn("Unexpected response format:", response);
        return {
            success: true,
            data: [],
            message: 'No results found'
        };
    };
};