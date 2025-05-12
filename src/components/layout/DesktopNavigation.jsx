import React from "react";
import { Link, useLocation } from "react-router";
import { ROUTES, buildRoute } from "../../routes/routeConstants";
import { useAppContext } from "../../context/AppContext";
import { isRouteActive } from "../../routes/routeUtils";
import SettingIcon from "../../assets/icons/SettingIcon";
import { getProfileImageUrl, formatUserFullName } from "../../utils/userUtils";
import { useUserData } from "../../hooks/useUserData";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "../layout/NotificationDropdown";

const DesktopNavigation = () => {
  const { currentUser, currentStable } = useAppContext();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const { userData, userLoading, loadingState } = useUserData();

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

  // Check if the user has stable access
  // Explicit check for undefined (user with a stable role 0, such as a stable manager)
  const hasStableAccess =
    currentStable?.id && user?.stableRoles?.[currentStable.id] !== undefined;

  return (
    <div className=" w-full bg-white shadow-md py-2">
      <div className="container max-w-full px-7 flex justify-between">
        <div className="flex items-center">
          <Link to={ROUTES.HOME}>
            <h1 className="text-2xl font-semibold text-black mr-25">Equilog</h1>
          </Link>
          {hasStableAccess && (
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
                Feed
              </Link>
              <Link
                to={buildRoute(ROUTES.STABLE_HORSES, {
                  stableId: currentStable?.id,
                })}
                className={`text-xl font-medium ${
                  isActive(ROUTES.STABLE_HORSES.split("/:")[0])
                    ? "text-primary"
                    : "text-black hover:text-primary"
                }`}
              >
                Horses
              </Link>
              <Link
                to={buildRoute(ROUTES.USER_PROFILE, {
                  userId: currentUser?.id,
                })}
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
          )}
        </div>
        <div className="flex items-center space-x-10">
          <Link to={ROUTES.NOTIFICATIONS} className="text-primary">
            <NotificationDropdown />
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
