import React from "react";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import { Home, Users, Rabbit, User } from "lucide-react";

const NavigationBar = () => {
  // Hardcoded for now, should be replaced with dynamic variables later
  const horseId = 1;
  const userId = 1;

  return (
    <div className="px-4 pb-4">
      <nav className="nav-container bg-primary-light rounded-full shadow-md">
        <Link to={ROUTES.HOME} className="p-2 text-primary" aria-label="Hem">
          <Home className="w-6 h-6" />
        </Link>

        <Link
          to={`/stable/${userId}`}
          className="p-2 text-primary"
          aria-label="Stall"
        >
          <Users className="w-6 h-6" />
        </Link>

        <Link
          to={`/horsepage/${horseId}`}
          className="p-2 text-primary"
          aria-label="Häst profil"
        >
          <Rabbit className="w-6 h-6" />
        </Link>

        <Link
          to={`/userpage/${userId}`}
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
