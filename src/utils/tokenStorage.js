const tokenStorage = {
    // Access token methods
    getAccessToken: () => {
        return sessionStorage.getItem("authToken");
    },

    setAccessToken: (token) => {
        sessionStorage.setItem("authToken", token);
    },

    removeAccessToken: () => {
        sessionStorage.removeItem("authToken");
    },

    // Refresh token methods
    getRefreshToken: () => {
        return sessionStorage.getItem("refreshToken");
    },

    setRefreshToken: (token) => {
        sessionStorage.setItem("refreshToken", token);
    },

    removeRefreshToken: () => {
        sessionStorage.removeItem("refreshToken");
    },

    // Combined methods for convenience
    storeTokens: (accessToken, refreshToken) => {
        tokenStorage.setAccessToken("authToken", accessToken);
        tokenStorage.setRefreshToken("refreshToken", refreshToken);
    },

    clearTokens: () => {
        tokenStorage.removeAccessToken("authToken");
        tokenStorage.removeRefreshToken("refreshToken");
    }
};

export default tokenStorage;