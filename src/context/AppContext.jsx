import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);

  return context;
};

export const AppProvider = ({ children }) => {
  // Default values. Need to load thorugh a localStorage, useMemo(), localSession??
  const [currentUser, setCurrentUser] = useState({
    id: 1, // Default user ID
    token:
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwianRpIjoiMjZkNDJlYTItNWFkMi00NjYzLTlhMDQtZWVjMTYyMTc2Njg1IiwibmJmIjoxNzQ0NzIzMTExLCJleHAiOjE3NDUwNjA2MTEsImlhdCI6MTc0NDcyMzExMSwiaXNzIjoiRXF1aWxvZ0FQSSIsImF1ZCI6IkVxdWlsb2dDbGllbnQifQ.Qbggs1FHzC-OmNi9IlwdKavKd5_Dy-qF9NLVrnR1p0Zhc-pYttt5sDjDsHjK-hmKRBf4Rcqx0cL9nbBdgmAvWQ",
  });

  const [currentStable, setCurrentStable] = useState({
    id: 2, // Default stable ID
  });

  const [selectedHorse, setSelectedHorse] = useState({
    id: 2,
  });

  // Update the current stable
  const changeStable = (id) => {
    setCurrentStable({ id });

    // Save to localStorage ??
    localStorage.setItem(currentStable, id);
  };

  // Function to update the current user
  const changeUser = (id, token = null) => {
    setCurrentUser({ id, token });

    // Save to localStorage ??
  };

  // Load values on initial load (StableId, UserId, TokenId) from local storage??
  // Implement useeffect to load data form storage

  const contextValue = {
    currentUser,
    currentStable,
    selectedHorse,
    changeStable,
    changeUser,
    setSelectedHorse,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
