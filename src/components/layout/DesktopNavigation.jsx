import React from "react";
import { Link, useLocation } from "react-router";
import { ROUTES, buildRoute } from "../../routes/index.jsx";
import { useAppContext } from "../../context/AppContext";
import { isRouteActive } from "../../routes/routeUtils";
import SettingIcon from "../../assets/icons/SettingIcon";
import { getProfileImageUrl, formatUserFullName } from "../../utils/userUtils";
import { useUserData } from "../../hooks/useUserData";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "../layout/NotificationDropdown";
import StableDropdown from "./StableDropdown";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";

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
  const displayUser = userData || user;
  const userId = displayUser?.id;
  const userFullName = formatUserFullName(displayUser);
  const profileImageUrl = getProfileImageUrl(displayUser?.profileImage);

  // Hide notification icon on certain routes
  const notificationHiddenRoutes = ["/stable-onboarding", "/select-stable"];
  const shouldHideNotification = notificationHiddenRoutes.includes(currentPath);

  // Check if the user has stable access
  // Explicit check for undefined (user with a stable role 0)
  const hasStableAccess =
    currentStable?.id && user?.stableRoles?.[currentStable.id] !== undefined;

  return (
    <div className="w-full bg-white shadow-md lg:h-16 2xl:h-20">
      <div className="container mx-auto px-7 flex justify-between items-center h-full">
        <div className="flex items-center">
          {/* Title */}
          <Link to={ROUTES.HOME}>
            <h1 className="text-2xl font- font-normal text-black mr-5">
              Equilog
            </h1>
          </Link>
          {/* Stable Name */}
          <div className="flex items-center">
            <StableDropdown />
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-10">
          {hasStableAccess && (
            <nav className="flex items-center space-x-8">
              {/* Home */}
              <Link
                to={ROUTES.HOME}
                className={`text-[16px] font-medium ${
                  isActive(ROUTES.HOME)
                    ? "text-primary"
                    : "text-black hover:text-primary"
                }`}
              >
                Home
              </Link>
              {/* Feed */}
              <Link
                to={buildRoute(ROUTES.STABLE_POST, {
                  stableId: currentStable?.id,
                })}
                className={`text-[16px] font-medium ${
                  isActive(ROUTES.STABLE_POST.split("/:")[0])
                    ? "text-primary"
                    : "text-black hover:text-primary"
                }`}
              >
                Feed
              </Link>
              {/* Horses */}
              <Link
                to={buildRoute(ROUTES.STABLE_HORSES, {
                  stableId: currentStable?.id,
                })}
                className={`text-[16px] font-medium ${
                  isActive(ROUTES.STABLE_HORSES.split("/:")[0])
                    ? "text-primary"
                    : "text-black hover:text-primary"
                }`}
              >
                Horses
              </Link>
              {/* Members */}
              <Link
                to={buildRoute(ROUTES.STABLE_MEMBERS, {
                  stableId: currentStable?.id,
                })}
                className={`text-[16px] font-medium ${
                  isActive(ROUTES.STABLE_MEMBERS.split("/:")[0])
                    ? "text-primary"
                    : "text-black hover:text-primary"
                }`}
                aria-label="Members"
              >
                Members
              </Link>
            </nav>
          )}
          {/* Settings icon */}
          <Link to={ROUTES.SETTINGS} className="text-primary">
            <SettingIcon className="w-6 h-6 text-primary" />
          </Link>
          {/* Notification icon */}
          {!shouldHideNotification && <NotificationDropdown />}
          {/* User image */}
          <Link
            to={buildRoute(ROUTES.USER_PROFILE, { userId })}
            className="text-primary"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden mr-4">
              <img
                src={profileImageUrl}
                alt={`Profile image of ${userFullName}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavigation;
