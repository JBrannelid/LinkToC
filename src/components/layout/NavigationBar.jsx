import React from "react";
import { Link, useLocation } from "react-router";
import { ROUTES, buildRoute } from "../../routes/routeConstants";
import { Home, Users, Rabbit, User } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { isRouteActive } from "../../routes/routeUtils";

const NavigationBar = () => {
  const { currentUser, selectedHorse, currentStable } = useAppContext();
  const location = useLocation();
  const currentPath = location.pathname;

  // Use isRouteActive with the current path
  const isActive = (path) => isRouteActive(path, currentPath);

  return (
    <div className="px-4 pb-4">
      <nav className="nav-container">
        <Link
          to={ROUTES.HOME}
          className={`p-2 ${
            isActive(ROUTES.HOME) ? "bg-white rounded-full" : "text-primary"
          }`}
          aria-label="Hem"
        >
          <Home
            className={`w-6 h-6 ${isActive(ROUTES.HOME) ? "text-primary" : ""}`}
          />
        </Link>

        <Link
          to={buildRoute(ROUTES.STABLE, { stableId: currentStable?.id })}
          className={`p-2 ${
            isActive(ROUTES.STABLE.split("/:")[0])
              ? "bg-white rounded-full"
              : "text-primary"
          }`}
          aria-label="Stall"
        >
          <Users
            className={`w-6 h-6 ${
              isActive(ROUTES.STABLE.split("/:")[0]) ? "text-primary" : ""
            }`}
          />
        </Link>

        <Link
          to={buildRoute(ROUTES.HORSE_PROFILE, {
            horseId: selectedHorse?.id || 2,
          })}
          className={`p-2 ${
            isActive(ROUTES.HORSE_PROFILE.split("/:")[0])
              ? "bg-white rounded-full"
              : "text-primary"
          }`}
          aria-label="Häst profil"
        >
          <Rabbit
            className={`w-6 h-6 ${
              isActive(ROUTES.HORSE_PROFILE.split("/:")[0])
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
          aria-label="Användarprofil"
        >
          <User
            className={`w-6 h-6 ${
              isActive(ROUTES.USER_PROFILE.split("/:")[0]) ? "text-primary" : ""
            }`}
          />
        </Link>
      </nav>
    </div>
  );
};

export default NavigationBar;
