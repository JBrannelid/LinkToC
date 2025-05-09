const tokenStorage = {
    // Access token methods
    getAccessToken: () => {
        return sessionStorage.getItem("authToken");
    },

    setAccessToken: (token) => {
        sessionStorage.setItem("authToken",token);
    },

    removeAccessToken: () => {
        sessionStorage.removeItem("authToken");
    },

    // Refresh token methods
    getRefreshToken: () => {
        return sessionStorage.getItem("refreshToken");
    },

    setRefreshToken: (token) => {
        sessionStorage.setItem( "refreshToken",token);
    },

    removeRefreshToken: () => {
        sessionStorage.removeItem("refreshToken");
    },

    // Combined methods for convenience
    storeTokens: (accessToken, refreshToken) => {
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);
    },

    clearTokens: () => {
        tokenStorage.removeAccessToken();
        tokenStorage.removeRefreshToken();
    }
};

export default tokenStorage;