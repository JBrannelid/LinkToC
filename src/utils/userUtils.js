// Handle navigation to stable management page
export const handleManageStables = () => {
  console.log("Manage Stables clicked");
};

// Handle terms of service navigation
export const handleTermsOfService = () => {
  console.log("Terms of service clicked");
};

// Handle support navigation
export const handleSupport = () => {
  console.log("Support clicked");
};

// Handle cookie settings
export const handleCookieSettings = () => {
  console.log("Cookie settings clicked");
};

// Handle switch stable action
export const handleSwitchStable = (navigate, ROUTES) => {
  navigate(ROUTES.SELECT_STABLE);
};

// Handle logout action
export const handleLogout = async (logout, navigate, setLoading, ROUTES) => {
  try {
    setLoading(true);
    await logout();
    navigate(ROUTES.LOGIN);
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setLoading(false);
  }
};
