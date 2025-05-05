import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

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

  // Selected horse state - initialize as null
  const [selectedHorse, setSelectedHorse] = useState(null);

  // Update the current stable
  const changeStable = (id, name = "") => {
    const stableData = { id, name };
    setCurrentStable(stableData);

    localStorage.setItem("currentStable", JSON.stringify(stableData));
  };

  // Load saved stable on initial mount
  useEffect(() => {
    const savedStable = localStorage.getItem("currentStable");
    if (savedStable) {
      try {
        setCurrentStable(JSON.parse(savedStable));
      } catch (error) {
        console.error("Error parsing saved stable:", error);
        // Reset to null
        setCurrentStable(null);
      }
    }
  }, []);

  const getCurrentStableRole = useCallback(() => {
    if (!currentStable || !user.stableRoles) {
      return USER_ROLES.USER; // Set to baser user if we don't know stable role och missing a stable id
    }
    const role = user.stableRoles[currentStable.id]; // Return role or fallback to base user

    return role !== undefined ? role : USER_ROLES.USER; // Fallback to base user
  }, [user?.stableRoles, currentStable?.id]);

  const contextValue = {
    currentUser: user,
    currentStable,
    changeStable,
    selectedHorse,
    setSelectedHorse,
    getCurrentStableRole,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// User role constants. Remove when we have a contact with BE
export const USER_ROLES = {
  USER: 0,
  ADMIN: 1,
  MANAGER: 2,
};

export default AppContext;
