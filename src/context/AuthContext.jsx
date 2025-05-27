import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./authContext.js";
import authService from "../api/services/authService.js";
import userService from "../api/services/userService";
import tokenStorage from "../utils/tokenStorage.js";

const parseJwt = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
        base64.length + (4 - (base64.length % 4)),
        "="
    );
    return JSON.parse(window.atob(paddedBase64));
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};
const refreshInterval = () => {
  try {
    const token = tokenStorage.getAccessToken();

    if (!token) {
      console.warn("No access token found");
      return null;
    }

    const payload = parseJwt(token);

    if (!payload || !payload.iat || !payload.exp) {
      console.warn("Could not parse token timestamps");
      return null;
    }

    const issuedAt = payload.iat * 1000;
    const expiresAt = payload.exp * 1000;
    const currentTime = Date.now();

    const totalLifetime = expiresAt - issuedAt;
    const timeUntilExpiry = expiresAt - currentTime;

    if (timeUntilExpiry <= 0) {
      console.warn("Token already expired");
      return null;
    }

    return Math.floor(totalLifetime * 0.95);
  } catch (error) {
    console.error("Error calculating refresh interval:", error);
    return null;
  }
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  
  // Fetch user-stable roles after token verification
  const verifyToken = useCallback(async () => {
    try {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        setUser(null);
        sessionStorage.removeItem("currentUser");
        setIsLoading(false);
        return false;
      }

      const userData = parseJwt(token);
      if (!userData || userData.exp * 1000 <= Date.now()) {
        tokenStorage.removeAccessToken();
        setUser(null);
        sessionStorage.removeItem("currentUser");
        setIsLoading(false);
        return false;
      } else {
        const userId = userData.sub;

        // Set basic user
        const basicUserInfo = {
          id: userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          token: token,
        };
        sessionStorage.setItem("currentUser", JSON.stringify(basicUserInfo));

        // Fetch user-stable roles from the API
        try {
          // Get user data from the API
          const userDataResponse = await userService.getById(userId);
          const fullUserData = userDataResponse?.value || {};

          // Get user base on a specifik stable Id
          const userStablesResponse = await userService.getUserStables(userId);

          // Extract stable roles from the response
          const stableRoles = Array.isArray(userStablesResponse)
            ? userStablesResponse.reduce((rolesByStableId, stableRole) => {
                rolesByStableId[stableRole.stableIdFk] = stableRole.role;
                return rolesByStableId;
              }, {})
            : {};
          const userWithRoles = {
            ...basicUserInfo,
            stableRoles: stableRoles,
            isNewUser: Object.keys(stableRoles).length === 0,
          };

          setUser(userWithRoles);
          sessionStorage.setItem("currentUser", JSON.stringify(userWithRoles));

          // Set complete user info with roles
          setUser({
            ...basicUserInfo,
            firstName: fullUserData.firstName || userData.firstName,
            lastName: fullUserData.lastName || userData.lastName,
            email: fullUserData.email || userData.email,
            phoneNumber: fullUserData.phoneNumber || userData.phoneNumber,
            profilePictureUrl:
              fullUserData.profilePictureUrl || userData.profilePictureUrl,
            stableRoles: stableRoles,
          });
        } catch {
          // Set basic user if role fetch fails
          setUser({
            ...basicUserInfo,
            stableRoles: {},
          });
        }

        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Token verification error:", error);
      tokenStorage.removeAccessToken();
      setUser(null);
      sessionStorage.removeItem("currentUser");
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = tokenStorage.getAccessToken("authToken");
      tokenStorage.removeAccessToken();
      setUser(null);
      setShowSessionWarning(false);

      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        setSessionTimeout(null);
      }
      if (token) {
        try {
          await authService.logout(token);
        } catch (error) {
          console.error("Error during server logout", error);
        }
      }
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }, [sessionTimeout]);

  const checkAndRefreshToken = useCallback(async () => {
    try {
      // Get the access and refresh tokens from storage
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken || !accessToken) return false;

      // Parse the JWT to check expiration
      const payload = parseJwt(accessToken);
      if (!payload || !payload.exp) return false;

      const response = await authService.refreshToken();
      if (response && response.isSuccess && response.value) {
        return true;
      }
      const currentTime = Date.now();
      return payload.exp * 1000 > currentTime;
    } catch (error) {
      console.error("Token check failed", error);
      return false;
    }
  }, []);

  const extendSession = useCallback(() => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
    setShowSessionWarning(false);
  }, [sessionTimeout]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  useEffect(() => {
    let intervalId = null;
    const setupTokenRefresh = () => {
      const refreshTime = refreshInterval();

      if (!refreshTime) {
        console.warn(
          "Could not calculate refresh interval, token might be invalid"
        );
        return null;
      }

      if (intervalId) {
        clearInterval(intervalId);
      }

      intervalId = setInterval(async () => {
        try {
          const isValid = await checkAndRefreshToken();
          if (!isValid && user) {
            const refreshResult = await authService.refreshToken();
            if (refreshResult && refreshResult.isSuccess) {
              setupTokenRefresh();
            } else {
              console.error("Token refresh unsuccessful");
            }
          }
        } catch (error) {
          console.error("Error on token refresh interval:", error);
        }
      }, refreshTime);
    };

    if (user) {
      setupTokenRefresh();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, checkAndRefreshToken]);

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);

      // Use authService to login
      const response = await authService.login({ email, password });

      // Handle the API response
      if (!response) {
        throw new Error("Login failed: No response from server");
      }

      // Extract tokens
      const accessToken = response?.value?.accessToken;
      const refreshToken = response?.value?.refreshToken;

      if (!accessToken || !refreshToken) {
        console.error("Unexpected response structure", response);
        throw new Error("Authentication failed: Invalid token response");
      }

      // Store tokens
      tokenStorage.setAccessToken(accessToken);
      tokenStorage.setRefreshToken(refreshToken);

      await verifyToken();

      // Check if user has a saved stable
      const savedStable = localStorage.getItem("currentStable");

      return { success: true, hasStable: !!savedStable };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  },[verifyToken]);

  const authFetch = useCallback(
    async (url, options = {}) => {
      let isValid = await verifyToken();

      if (!isValid) {
        try {
          const refreshResult = await authService.refreshToken();
          if (refreshResult && refreshResult.isSuccess) {
            isValid = await verifyToken();
          }
        } catch (error) {
          console.error("Token refresh during fetch failed:", error);
        }
      }
      if (!isValid) {
        throw new Error("Session expired. Please log in again.");
      }

      const token = tokenStorage.getAccessToken();

      const authOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, authOptions);

      if (response.status === 401) {
        await logout();
        throw new Error("Session expired. Please log in again.");
      }
      return response;
    },
    [verifyToken, logout]
  );

  const authContextValue = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      authFetch,
      verifyToken,
      checkAndRefreshToken,
      extendSession,
      isAuthenticated: !!user,
      showSessionWarning,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      authFetch,
      verifyToken,
      checkAndRefreshToken,
      extendSession,
      showSessionWarning,
    ]
  );
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
