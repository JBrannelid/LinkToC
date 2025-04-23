import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

export const AppProvider = ({ children }) => {
  // Get authentication state from AuthContext
  const { user } = useAuth();

  // Current stable state (for the selected stable)
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

  const contextValue = {
    currentUser: user,
    currentStable,
    changeStable,
    selectedHorse,
    setSelectedHorse,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
