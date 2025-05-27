export const handleManageStables = (navigate, ROUTES) => {
  navigate(ROUTES.MANAGE_STABLE);
};

export const handleStableRequests = (navigate, ROUTES) => {
  navigate(ROUTES.STABLE_REQUESTS);
};

export const handleTermsOfService = () => {
  window.open("/terms-of-service");
};

export const handleSupport = () => {
  window.open("/support");
};

export const handleCookieSettings = () => {
  window.open("/coockie_settings");
};

export const handleSwitchStable = (navigate, ROUTES) => {
  navigate(ROUTES.SELECT_STABLE);
};

export const handleManageHorses = (navigate, ROUTES) => {
  navigate(ROUTES.MANAGE_HORSES);
};

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

export const handleProfileUpdate = async (
  data,
  updateUserData,
  verifyToken
) => {
  const result = await updateUserData(data);

  if (result.success) {
    // Refresh user token to get updated info
    await verifyToken();
  }

  return result;
};

export const formatUserFullName = (user) => {
  if (!user) return "Unknown";
  return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown";
};

export const getRoleName = (role) => {
  switch (role) {
    case 0:
      return "Owner";
    case 1:
      return "Admin";
    case 2:
      return "Member";
    default:
      return "";
  }
};

export const USER_ROLES = {
  USER: 2,
  ADMIN: 1,
  MANAGER: 0,
};
