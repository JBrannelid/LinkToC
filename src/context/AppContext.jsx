import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { USER_ROLES } from "../utils/userUtils";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentStable, setCurrentStable] = useState(() => {
    // Try to load from localStorage on initial render
    const savedStable = localStorage.getItem("currentStable");
    return savedStable ? JSON.parse(savedStable) : null;
  });

  const [stableRefreshKey, setStableRefreshKey] = useState(0);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [bypassSecurity, setBypassSecurity] = useState(false);

  // Update the current stable
  const changeStable = (id, name = "") => {
    // Check if this is a newly created stable with a bypass flag
    const newStableFlag = sessionStorage.getItem("newStableCreated");
    const isNewStable = newStableFlag === "true" && newStableFlag !== null;
    const shouldBypassCheck = bypassSecurity || isNewStable;

    // Add explicit check for undefined (user with a stable role 0, such as a stable manager)
    if (
      !shouldBypassCheck &&
      user?.stableRoles &&
      user.stableRoles[id] === undefined
    ) {
      console.error(
        "SECURITY ERROR: User is trying to set stable ${id} without membership!"
      );
      localStorage.removeItem("currentStable");
      setCurrentStable(null);
      return false;
    }

    // This bypass will not copremise security, as it is only used for newly created stables
    if (isNewStable) {
      console.log("Bypassing security check for newly created stable");
      sessionStorage.removeItem("newStableCreated");
    }

    const stableData = { id, name };
    setCurrentStable(stableData);
    localStorage.setItem("currentStable", JSON.stringify(stableData));

    setStableRefreshKey((prev) => prev + 1);
    return true;
  };

  const enableSecurityBypass = () => {
    setBypassSecurity(true);
    // Auto-disable after a short delay for safety
    setTimeout(() => setBypassSecurity(false), 2000);
  };

  // Load saved stable on initial mount
  useEffect(() => {
    const savedStable = localStorage.getItem("currentStable");
    if (savedStable) {
      try {
        const parsed = JSON.parse(savedStable);
        // explicit check for undefined (user with a stable role 0, such as a stable manager)
        if (user?.stableRoles && user.stableRoles[parsed.id] === undefined) {
          console.warn(
            "User does not have access to the saved stable, remove stable data..."
          );
          localStorage.removeItem("currentStable");
          setCurrentStable(null);
        }
      } catch (error) {
        console.error("Error parsing saved stable:", error);
        localStorage.removeItem("currentStable");
        setCurrentStable(null);
      }
    }
  }, [user?.stableRoles]);

  const getCurrentStableRole = useCallback(() => {
    if (!currentStable || !user.stableRoles) {
      return USER_ROLES.USER;
    }
    const role = user.stableRoles[currentStable.id];

    // explicit check for undefined (user with a stable role 0, such as a stable manager)
    return role !== undefined ? role : USER_ROLES.USER;
  }, [user?.stableRoles, currentStable?.id]);

  const contextValue = {
    currentUser: user,
    currentStable,
    changeStable,
    enableSecurityBypass,
    selectedHorse,
    setSelectedHorse,
    getCurrentStableRole,
    stableRefreshKey,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
