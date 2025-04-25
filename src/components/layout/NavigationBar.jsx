import React from "react";
import { Link } from "react-router";
import { ROUTES, buildRoute } from "../../routes/routeConstants";
import { Home, Users, Rabbit, User } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const NavigationBar = () => {
  const { currentUser, selectedHorse, currentStable } = useAppContext();

  return (
    <div className="px-4 pb-4">
      <nav className="nav-container">
        <Link to={ROUTES.HOME} className="p-2 text-primary" aria-label="Hem">
          <Home className="w-6 h-6" />
        </Link>

        <Link
          to={buildRoute(ROUTES.STABLE, { stableId: currentStable?.id })}
          className="p-2 text-primary"
          aria-label="Stall"
        >
          <Users className="w-6 h-6" />
        </Link>

        <Link
          to={buildRoute(ROUTES.HORSE_PROFILE, {
            // Remove hardcoded horse id when we have a create horse UI
            horseId: selectedHorse?.id || 2,
          })}
          className="p-2 text-primary"
          aria-label="Häst profil"
        >
          <Rabbit className="w-6 h-6" />
        </Link>

        <Link
          to={buildRoute(ROUTES.USER_PROFILE, { userId: currentUser?.id })}
          className="p-2 text-primary"
          aria-label="Användarprofil"
        >
          <User className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  );
};

export default NavigationBar;
