import React from "react";
import { Link, useLocation } from "react-router";
import FeedIcon from "../../assets/icons/FeedIcon";
import HomeIcon from "../../assets/icons/HomeIcon";
import HorseFaceIcon from "../../assets/icons/HorseFaceIcon";
import UserIcon from "../../assets/icons/UserIcon";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAuth } from "../../hooks/useAuth.js";
import { ROUTES, buildRoute } from "../../routes/index.jsx";
import { isRouteActive } from "../../routes/routeUtils";

const NavigationBar = () => {
  const { user } = useAuth();
  const { currentStable } = useAppContext();
  const location = useLocation();
  const currentPath = location.pathname;

  // Use isRouteActive with the current path
  const isActive = (path) => isRouteActive(path, currentPath);

  // Check if the user has stable access
  const hasStableAccess =
    currentStable?.id && user?.stableRoles?.[currentStable.id] !== undefined;

  return (
    <div className="w-full md:max-w-[70%] mx-auto bg-transparent">
      {hasStableAccess && (
        <nav
          className="nav-container"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            to={ROUTES.HOME}
            className={`p-2 ${
              isActive(ROUTES.HOME)
                ? "bg-background rounded-full"
                : "text-primary"
            }`}
            aria-label="Home"
          >
            <HomeIcon
              className={`w-8 h-8 ${
                isActive(ROUTES.HOME) ? "text-primary" : ""
              }`}
            />
          </Link>

          <Link
            to={buildRoute(ROUTES.STABLE_POST, { stableId: currentStable?.id })}
            className={`p-2 ${
              isActive(ROUTES.STABLE_POST.split("/:")[0])
                ? "bg-background rounded-full"
                : "text-primary"
            }`}
            aria-label="Feed"
          >
            <FeedIcon
              className={`w-8 h-8 ${
                isActive(ROUTES.STABLE_POST.split("/:")[0])
                  ? "bg-background rounded-full"
                  : "text-primary"
              }`}
            />
          </Link>

          <Link
            to={buildRoute(ROUTES.STABLE_HORSES, {
              stableId: currentStable?.id,
            })}
            className={`p-2 ${
              isActive(ROUTES.STABLE_HORSES.split("/:")[0])
                ? "bg-background rounded-full"
                : "text-primary"
            }`}
            aria-label="Horses"
          >
            <HorseFaceIcon
              className={`w-8 h-8 ${
                isActive(ROUTES.STABLE_HORSES.split("/:")[0])
                  ? "bg-background rounded-full"
                  : "text-primary"
              }`}
            />
          </Link>

          <Link
            to={buildRoute(ROUTES.STABLE_MEMBERS, {
              stableId: currentStable?.id,
            })}
            className={`p-2 ${
              isActive(ROUTES.STABLE_MEMBERS.split("/:")[0])
                ? "bg-background rounded-full"
                : "text-primary"
            }`}
            aria-label="Members"
          >
            <UserIcon
              className={`w-8 h-8 ${
                isActive(ROUTES.STABLE_MEMBERS.split("/:")[0])
                  ? "bg-background rounded-full"
                  : "text-primary"
              }`}
            />
          </Link>
        </nav>
      )}
    </div>
  );
};

export default NavigationBar;
