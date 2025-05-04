import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import SessionTimeoutWarning from "../auth/SessionTimeoutWarning.jsx";
import authService from "../api/services/authService.js";
import userService from "../api/services/userService";

const AuthContext = createContext();

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
      const decoded = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );

      // Extract role information [user[0] admin[1] masteradmin[2]]
      return decoded;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  // Fetch user-stable roles after token verification
  const verifyToken = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return false;
      }

      const userData = parseJwt(token);
      if (!userData || userData.exp * 1000 <= Date.now()) {
        sessionStorage.removeItem("authToken");
        setUser(null);
        setIsLoading(false);
        return false;
      } else {
        const userId = userData.sub;

        console.warn("Invalid or expired JWT token", userData);

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
          setUser(basicUserInfo);
        }

        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Token verification error:", error);
      sessionStorage.removeItem("authToken");
      setUser(null);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      sessionStorage.removeItem("authToken");
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
      const token = sessionStorage.getItem("authToken");
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (!token || !refreshToken) return false;

      // Parse the JWT to check expiration
      const payload = parseJwt(token);
      if (!payload || !payload.exp) return false;

      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiresAt - currentTime;

      // If token is close to expiring (less than 10 minutes), refresh it
      if (timeUntilExpiry > 0 && timeUntilExpiry < 10 * 60 * 1000) {
        try {
          // Call your refresh token API
          const response = await authService.refreshToken(refreshToken);

          // Check if the response contains new tokens
          if (response && response.isSuccess && response.value) {
            const newAccessToken = response.value.accessToken;
            const newRefreshToken = response.value.refreshToken;

            if (newAccessToken && newRefreshToken) {
              // Store the new tokens
              sessionStorage.setItem("authToken", newAccessToken);
              sessionStorage.setItem("refreshToken", newRefreshToken);
              return true;
            }
          }
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
        }
      }

      // Return true if token is still valid
      return timeUntilExpiry > 0;
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
    const interval = setInterval(() => {
      checkAndRefreshToken().then((isValid) => {
        if (!isValid && !sessionTimeout && user) {
          setShowSessionWarning(true);
          const timeout = setTimeout(() => {
            logout();
            //Redirect to login
          }, 5 * 60 * 1000); // 5 min warning
          setSessionTimeout(timeout);
          //Display message to user if Token is getting old, "5 min left of session"
        }
      });
    }, 15 * 60 * 1000); // Check every 15 minutes

    return () => {
      clearInterval(interval);
      if (sessionTimeout) clearTimeout(sessionTimeout);
    };
  }, [checkAndRefreshToken, sessionTimeout, user, logout]);

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
      sessionStorage.setItem("authToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

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
      const isValid = await verifyToken();
      if (!isValid) {
        throw new Error("Session expired. Please log in again.");
      }

      const token = sessionStorage.getItem("authToken");

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
