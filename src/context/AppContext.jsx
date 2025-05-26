import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { USER_ROLES } from "../utils/userUtils";

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
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
  const [bs, sbs] = useState(false);

  // Update the current stable
  const changeStable = useCallback(
    (id, name = "") => {
      // Check if this is a newly created stable
      const newStableFlag = sessionStorage.getItem("newStableCreated");
      const isNewStable = newStableFlag === "true" && newStableFlag !== null;
      const sbc = bs || isNewStable;

      // Add explicit check for undefined (user with a stable role 0, such as a stable manager)
      if (!sbc && user?.stableRoles && user.stableRoles[id] === undefined) {
        console.error(
          "SECURITY ERROR: User is trying to set stable ${id} without membership!"
        );
        localStorage.removeItem("currentStable");
        setCurrentStable(null);
        return false;
      }

      // Only used for newly created stables
      if (isNewStable) {
        sessionStorage.removeItem("newStableCreated");
      }

      const stableData = { id, name };
      setCurrentStable(stableData);
      localStorage.setItem("currentStable", JSON.stringify(stableData));

      setStableRefreshKey((prev) => prev + 1);
      return true;
    },
    [user?.stableRoles, bs, setCurrentStable, setStableRefreshKey]
  );

  const enableSecurityBypass = () => {
    sbs(true);
    // Auto-disable after a short delay for safety
    setTimeout(() => sbs(false), 2000);
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
    UserRoles: USER_ROLES,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
