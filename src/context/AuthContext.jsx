import {createContext, useCallback, useContext, useEffect, useMemo, useState,} from "react";
import SessionTimeoutWarning from "../auth/SessionTimeoutWarning.jsx";
import authService from "../api/services/authService.js";
import userService from "../api/services/userService";
import tokenStorage from "../utils/tokenStorage.js";

const AuthContext = createContext(undefined);


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  const parseJwt = (token) => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) {
        return null;
      }
      // Extract role information [user[0] admin[1] masteradmin[2]]
      return JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
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
      
      return Math.floor(totalLifetime * 0.95)
    }catch (error) {
      console.error("Error calculating refresh interval:", error);
      return 5 * 60 * 1000;
    }
  }
  
  // Fetch user-stable roles after token verification
  const verifyToken = useCallback(async () => {
    try {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return false;
      }

      const userData = parseJwt(token);
      if (!userData || userData.exp * 1000 <= Date.now()) {
        console.warn("Invalid or expired JWT token", userData);
        tokenStorage.removeAccessToken();
        setUser(null);
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
          userName: userData.userName,
          token: token,
        };

        // Fetch user-stable roles from the API
        try {
          // Get user base on a specifik stable Id
          const userStablesResponse = await userService.getUserStables(userId);

          // Extract stable roles from the response
          const stableRoles = Array.isArray(userStablesResponse)
            ? userStablesResponse.reduce((rolesByStableId, stableRole) => {
                rolesByStableId[stableRole.stableIdFk] = stableRole.role;
                return rolesByStableId;
              }, {})
            : {};

          // Set complete user info with roles
          setUser({
            ...basicUserInfo,
            stableRoles: stableRoles,
          });
        } catch (rolesError) {
          console.error(
            "Failed to fetch user-stable roles:",
            rolesError,
            basicUserInfo
          );
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
        console.warn("Could not calculate refresh interval, token might be invalid");
        return null;
      }
      
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      intervalId = setInterval (async() => {
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
          console.error("Error on token refresh interval:",  error);
        }
      }, refreshTime);
    };
    
    if(user) {
      setupTokenRefresh(); 
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [ user, checkAndRefreshToken, refreshInterval]);

  const login = async (email, password) => {
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
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const authFetch = useCallback(
    async (url, options = {}) => {
      let isValid = await verifyToken();
      
      if (!isValid) {
        try {
          const refreshResult = await authService.refreshToken();
          if (refreshResult && refreshResult.isSuccess) {
            isValid = await verifyToken();
          }
        }catch (error) {
          console.error("Token refresh during fetch failed:", error);
        }
      }
      if (!isValid) {
        // await logout();
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
      {showSessionWarning && (
        <SessionTimeoutWarning onExtend={extendSession} onLogout={logout} />
      )}
    </AuthContext.Provider>
  );
};
