import React from "react";
import { Link, useLocation } from "react-router";
import { ROUTES, buildRoute } from "../../routes/routeConstants";
import { useAppContext } from "../../context/AppContext";
import { isRouteActive } from "../../routes/routeUtils";
import SettingIcon from "../../assets/icons/SettingIcon";
import NotificationIcon from "../../assets/icons/NotificationIcon";
import { getProfileImageUrl, formatUserFullName } from "../../utils/userUtils";
import { useUserData } from "../../hooks/useUserData";
import { useAuth } from "../../context/AuthContext";

const DesktopNavigation = () => {
  const { currentUser, selectedHorse, currentStable } = useAppContext();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  // Fetch user data with loading handling
  const { userData, userLoading, loadingState } = useUserData();

  // Display loading spinner
  if (userLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="medium" className="text-gray" />
        <p className="ml-2">{loadingState.getMessage()}</p>
      </div>
    );
  }

  const isActive = (path) => isRouteActive(path, currentPath);
  // Get data from database (userData) or JWT (user)
  const displayUser = userData || user;
  const userFullName = formatUserFullName(displayUser);
  const profileImageUrl = getProfileImageUrl(displayUser?.profileImage);

  return (
    <div className=" w-full bg-white shadow-md py-2">
      <div className="container max-w-full px-7 flex justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-black mr-25">Equilog</h1>
          <nav className="flex items-center space-x-8">
            <Link
              to={ROUTES.HOME}
              className={`text-xl font-medium ${
                isActive(ROUTES.HOME)
                  ? "text-primary"
                  : "text-black hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              to={buildRoute(ROUTES.STABLE_POST, {
                stableId: currentStable?.id,
              })}
              className={`text-xl font-medium ${
                isActive(ROUTES.STABLE_POST.split("/:")[0])
                  ? "text-primary"
                  : "text-black hover:text-primary"
              }`}
            >
              Board
            </Link>
            <Link
              to={buildRoute(ROUTES.HORSE_PROFILE, {
                horseId: selectedHorse?.id || 2,
              })}
              className={`text-xl font-medium ${
                isActive(ROUTES.HORSE_PROFILE.split("/:")[0])
                  ? "text-primary"
                  : "text-black hover:text-primary"
              }`}
            >
              Horses
            </Link>
            <Link
              to={buildRoute(ROUTES.USER_PROFILE, { userId: currentUser?.id })}
              className={`text-xl font-medium ${
                isActive(ROUTES.USER_PROFILE.split("/:")[0])
                  ? "text-primary"
                  : "text-black hover:text-primary"
              }`}
              aria-label="Användarprofil"
            >
              Members
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-10">
          <Link to={ROUTES.NOTIFICATIONS} className="text-primary">
            <NotificationIcon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </Link>
          <Link to={ROUTES.SETTINGS} className="text-primary">
            <SettingIcon
              strokeWidth={9}
              className="w-6 h-6 md:w-7 md:h-7 text-primary"
            />
          </Link>
          {/* Display user image */}
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img
              src={profileImageUrl}
              alt={`Profile image of ${userFullName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavigation;
