import React from "react";
import { Link, useLocation } from "react-router";
import { ROUTES, buildRoute } from "../../routes/routeConstants";
import { useAppContext } from "../../context/AppContext";
import { isRouteActive } from "../../routes/routeUtils";
import FeedIcon from "../../assets/icons/FeedIcon";
import HomeIcon from "../../assets/icons/HomeIcon";
import HorseFaceIcon from "../../assets/icons/HorseFaceIcon";
import UserIcon from "../../assets/icons/UserIcon";
import { useAuth } from "../../context/AuthContext";

const NavigationBar = () => {
  const { user } = useAuth();
  const { currentUser, currentStable } = useAppContext();
  const location = useLocation();
  const currentPath = location.pathname;

  // Use isRouteActive with the current path
  const isActive = (path) => isRouteActive(path, currentPath);

  // Check if the user has stable access
  const hasStableAccess =
    currentStable?.id && user?.stableRoles?.[currentStable.id] !== undefined;

  return (
    <div className="w-full md:max-w-[70%] mx-auto">
      {hasStableAccess && (
        <nav className="nav-container">
          <Link
            to={ROUTES.HOME}
            className={`p-2 ${
              isActive(ROUTES.HOME) ? "bg-white rounded-full" : "text-primary"
            }`}
            aria-label="Home"
          >
            <HomeIcon
              className={`w-6 h-6 ${
                isActive(ROUTES.HOME) ? "text-primary" : ""
              }`}
            />
          </Link>

          <Link
            to={buildRoute(ROUTES.STABLE_POST, { stableId: currentStable?.id })}
            className={`p-2 ${
              isActive(ROUTES.STABLE_POST.split("/:")[0])
                ? "bg-white rounded-full"
                : "text-primary"
            }`}
            aria-label="Feed"
          >
            <FeedIcon
              className={`w-6 h-6 ${
                isActive(ROUTES.STABLE_POST.split("/:")[0])
                  ? "text-primary"
                  : "currentColor"
              }`}
            />
          </Link>

          <Link
            to={buildRoute(ROUTES.STABLE_HORSES, {
              stableId: currentStable?.id,
            })}
            className={`p-2 ${
              isActive(ROUTES.STABLE_HORSES.split("/:")[0])
                ? "bg-white rounded-full"
                : "text-primary"
            }`}
            aria-label="Horses"
          >
            <HorseFaceIcon
              className={`w-6 h-6 ${
                isActive(ROUTES.STABLE_HORSES.split("/:")[0])
                  ? "text-primary"
                  : ""
              }`}
            />
          </Link>

          <Link
            to={buildRoute(ROUTES.USER_PROFILE, { userId: currentUser?.id })}
            className={`p-2 ${
              isActive(ROUTES.USER_PROFILE.split("/:")[0])
                ? "bg-white rounded-full"
                : "text-primary"
            }`}
            aria-label="Members"
          >
            <UserIcon
              className={`w-6 h-6 ${
                isActive(ROUTES.USER_PROFILE.split("/:")[0])
                  ? "text-primary"
                  : ""
              }`}
            />
          </Link>
        </nav>
      )}
    </div>
  );
};

export default NavigationBar;
