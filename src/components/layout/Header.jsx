import React from "react";
import { Link, useLocation } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import SettingIcon from "../../assets/icons/SettingIcon";
import NotificationIcon from "../../assets/icons/NotificationIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import Button from "../ui/Button";

export default function Header() {
  const location = useLocation();
  const showBackButton =
    location.pathname.includes("/manage-stable") ||
    location.pathname.includes("/stable-requests") ||
    location.pathname.includes("/notifications");

  return (
    <div className="relative py-5 lg:hidden">
      {/* Left side */}
      <Link
        to={ROUTES.SETTINGS} // Open settings
        aria-label="Inställningar"
        className="absolute left-4 top-4"
      >
        <SettingIcon
          strokeWidth={9}
          className="w-6 h-6 md:w-8 md:h-8 text-primary"
        />
      </Link>

      {/* Right side */}
      {showBackButton ? (
        <Button
          onClick={() => window.history.back()} // Go back
          type="icon"
          className="absolute right-0 top-3 border-0 text-primary"
          aria-label="Close"
        >
          <CloseIcon size={30} strokeWidth={2} className="text-primary" />
        </Button>
      ) : (
        <Link
          to="/notifications" // Open notification
          aria-label="Notifikationer"
          className="absolute right-4 top-4 border-0 text-primary"
        >
          <NotificationIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        </Link>
      )}
    </div>
  );
}
