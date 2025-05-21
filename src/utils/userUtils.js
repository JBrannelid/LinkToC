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

export const constructProfileImageUrl = (profilePicture) => {
  if (!profilePicture) return null;

  // Check if it's already a full URL
  if (profilePicture.startsWith("http")) return profilePicture;

  const baseUrl = "http://127.0.0.1:10000/devstoreaccount1/equilog-media";

  // Always construct the full path using user ID from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser?.id;

  // Log the full constructed URL for debugging
  const fullUrl = `${baseUrl}/profile-pictures/${userId}/${profilePicture}`;
  console.log("constructProfileImageUrl - building full URL:", fullUrl);

  return fullUrl;
};

export const getProfileImageUrl = (
  user,
  size = "default",
  fallbackUrl = null
) => {
  const profileImage = user?.profilePicture;

  // If user has a custom profile image, construct the full URL
  if (profileImage) {
    const url = constructProfileImageUrl(profileImage);
    // cache-busting with a random value
    return `${url}?t=${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;
  }

  // Return the appropriate placeholder
  switch (size) {
    case "small":
      return "/src/assets/images/userPlaceholderSmall.webp";
    case "medium":
      return "/src/assets/images/userPlaceholdermedium.webp";
    case "large":
      return "/src/assets/images/userPlaceholderLarge.webp";
    case "rounded":
      return "/src/assets/images/userPlaceholderRounded.webp";
    default:
      return fallbackUrl || "/src/assets/images/userPlaceholderRounded.webp";
  }
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
