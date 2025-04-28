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

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  const parseJwt = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        return null;
      }
      return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

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

        setUser({
          id: userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          userName: userData.userName,
          token: token,
        });
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
      const token = sessionStorage.getItem("authToken");
      if (!token) return false;

      const payload = parseJwt(token);
      if (!payload || !payload.iat || !payload.exp) return false;

      const issuedAt = payload.iat * 1000;
      const expiresAt = payload.exp * 1000;
      const currentTime = Date.now();

      const tokenAge = currentTime - issuedAt;
      const MAX_TOKEN_AGE = 4 * 60 * 60 * 1000;
      const isWithinMaxAge = tokenAge <= MAX_TOKEN_AGE;

      const timeUntilExpiry = expiresAt - currentTime;
      const isNearingExpiration =
        timeUntilExpiry > 0 && timeUntilExpiry < 10 * 60 * 1000;

      if (isWithinMaxAge && isNearingExpiration) {
        try {
          const response = await authService.refreshToken(token);

          if (response && response.value && response.value.token) {
            sessionStorage.setItem("authToken", response.value.token);
            return true;
          }
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
        }
      }
      return isWithinMaxAge && timeUntilExpiry > 0;
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

      if (response.data && typeof response.data === "object") {
        console.log("Data keys:", Object.keys(response.data));
      }

      // Handle the API response
      if (!response) {
        throw new Error("Login failed: No response from server");
      }

      // Extract token
      const token = response?.value?.token;
      if (!token) {
        console.error("Unexpected response structure", response);
        throw new Error("Authentication failed: Invalid token response");
      }

      if (!token) {
        console.error("Unexpected response structure", response);
        throw new Error("Authentication failed: Invalid token response");
      }

      // Store token and verify it
      sessionStorage.setItem("authToken", token);
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
