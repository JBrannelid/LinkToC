import { motion } from "framer-motion";
import React from "react";
import { Link, useLocation } from "react-router";
import NotificationDropdown from "./NotificationDropdown.jsx";
import StableDropdown from "./StableDropdown";
import SettingIcon from "../../assets/icons/SettingIcon";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useUserData } from "../../hooks/useUserData";
import { ROUTES, buildRoute } from "../../routes/index.jsx";
import { isRouteActive } from "../../routes/routeUtils";
import ProfileImage from "../common/ProfileImage.jsx";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";

const DesktopNavigation = () => {
  const { currentUser: _currentUser, currentStable } = useAppContext();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const { userData, userLoading, loadingState } = useUserData();

  if (userLoading) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <LoadingSpinner size="medium" className="text-gray" />
        <p className="ml-2">{loadingState.getMessage()}</p>
      </div>
    );
  }

  const isActive = (path) => isRouteActive(path, currentPath);
  const displayUser = userData || user;
  const userId = displayUser?.id;

  // Hide notification icon on certain routes
  const notificationHiddenRoutes = ["/stable-onboarding", "/select-stable"];
  const shouldHideNotification = notificationHiddenRoutes.includes(currentPath);

  // Check if the user has stable access
  // Explicit check for undefined (user with a stable role 0)
  const hasStableAccess =
    currentStable?.id && user?.stableRoles?.[currentStable.id] !== undefined;

  return (
    <header
      className="w-full bg-white shadow-md lg:h-16 2xl:h-20"
      role="banner"
    >
      <div className="container mx-auto px-7 flex justify-between items-center h-full">
        {/* Left side - Brand and Stable */}
        <div className="flex items-center">
          {/* Brand */}
          <Link
            to={ROUTES.HOME}
            aria-label="Equilog home page"
            className="hover:text-primary transition-colors"
          >
            <h1 className="text-2xl font-normal text-black mr-5">Equilog</h1>
          </Link>

          {/* Stable Selector */}
          {hasStableAccess && (
            <div
              className="flex items-center"
              role="region"
              aria-label="Stable selection"
            >
              <StableDropdown />
            </div>
          )}
        </div>

        {/* Right side - Navigation and User Actions */}
        <div className="flex items-center space-x-10">
          {/* Main Navigation */}
          {hasStableAccess && (
            <motion.nav
              className="flex items-center space-x-8"
              role="navigation"
              aria-label="Main navigation"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  to={ROUTES.HOME}
                  className={`text-[16px] font-medium transition-colors ${
                    isActive(ROUTES.HOME)
                      ? "text-primary"
                      : "text-black hover:text-primary"
                  }`}
                  aria-label="Go to dashboard home"
                  aria-current={isActive(ROUTES.HOME) ? "page" : undefined}
                >
                  Home
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  to={buildRoute(ROUTES.STABLE_POST, {
                    stableId: currentStable?.id,
                  })}
                  className={`text-[16px] font-medium transition-colors ${
                    isActive(ROUTES.STABLE_POST.split("/:")[0])
                      ? "text-primary"
                      : "text-black hover:text-primary"
                  }`}
                  aria-label="View stable feed and posts"
                  aria-current={
                    isActive(ROUTES.STABLE_POST.split("/:")[0])
                      ? "page"
                      : undefined
                  }
                >
                  Feed
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  to={buildRoute(ROUTES.STABLE_HORSES, {
                    stableId: currentStable?.id,
                  })}
                  className={`text-[16px] font-medium transition-colors ${
                    isActive(ROUTES.STABLE_HORSES.split("/:")[0])
                      ? "text-primary"
                      : "text-black hover:text-primary"
                  }`}
                  aria-label="View and manage horses"
                  aria-current={
                    isActive(ROUTES.STABLE_HORSES.split("/:")[0])
                      ? "page"
                      : undefined
                  }
                >
                  Horses
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  to={buildRoute(ROUTES.STABLE_MEMBERS, {
                    stableId: currentStable?.id,
                  })}
                  className={`text-[16px] font-medium transition-colors ${
                    isActive(ROUTES.STABLE_MEMBERS.split("/:")[0])
                      ? "text-primary"
                      : "text-black hover:text-primary"
                  }`}
                  aria-label="View and manage stable members"
                  aria-current={
                    isActive(ROUTES.STABLE_MEMBERS.split("/:")[0])
                      ? "page"
                      : undefined
                  }
                >
                  Members
                </Link>
              </motion.div>
            </motion.nav>
          )}

          {/* User Actions */}
          <motion.div
            className="flex items-center space-x-4"
            role="region"
            aria-label="User actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Settings */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={ROUTES.SETTINGS}
                className="text-primary hover:text-primary-dark transition-colors"
                aria-label="Open settings and preferences"
              >
                <SettingIcon
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
                <span className="sr-only">Settings</span>
              </Link>
            </motion.div>

            {/* Notifications */}
            {!shouldHideNotification && (
              <div>
                <NotificationDropdown />
              </div>
            )}

            {/* User Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={buildRoute(ROUTES.USER_PROFILE, { userId })}
                className="text-primary hover:text-primary-dark transition-colors"
                aria-label={`View profile for ${
                  displayUser?.firstName || "user"
                } ${displayUser?.lastName || ""}`}
              >
                <motion.div
                  className="w-9 h-9 rounded-full overflow-hidden mr-4 border-2 border-transparent"
                  whileHover={{ borderColor: "rgb(var(--color-primary))" }}
                  transition={{ duration: 0.2 }}
                >
                  <ProfileImage
                    user={displayUser}
                    className="w-full h-full"
                    alt={`Profile picture of ${
                      displayUser?.firstName || "user"
                    } ${displayUser?.lastName || ""}`}
                  />
                </motion.div>
                <span className="sr-only">User profile</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default DesktopNavigation;
