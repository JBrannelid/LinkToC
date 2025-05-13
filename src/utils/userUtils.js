export const handleManageStables = (navigate, ROUTES) => {
  navigate(ROUTES.MANAGE_STABLE);
};

export const handleStableRequests = (navigate, ROUTES) => {
  navigate(ROUTES.STABLE_REQUESTS);
};

export const handleTermsOfService = () => {
  console.log("Terms of service clicked");
};

export const handleSupport = () => {
  console.log("Support clicked");
};

export const handleCookieSettings = () => {
  console.log("Cookie settings clicked");
};

export const handleSwitchStable = (navigate, ROUTES) => {
  navigate(ROUTES.SELECT_STABLE);
};

export const handleManageHorses = (navigate, ROUTES) => {
  console.log("Manage horses clicked");
}

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
  if (!user) return "Okänd";
  return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Okänd";
};

export const getProfileImageUrl = (
  profileImageUrl,
  fallbackUrl = "/src/assets/images/userPlaceholder.jpg"
) => {
  return profileImageUrl || fallbackUrl;
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
