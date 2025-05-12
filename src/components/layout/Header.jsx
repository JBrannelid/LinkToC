import React from "react";
import { Link, useLocation } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import SettingIcon from "../../assets/icons/SettingIcon";
import NotificationIcon from "../../assets/icons/NotificationIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import Button from "../ui/Button";
import mockNotificationsData from "../../testing/mockNotifications.json";

export default function Header() {
  const location = useLocation();

  // Show back button if the current path is one of the following
  const showBackButton =
    location.pathname.includes("/manage-stable") ||
    location.pathname.includes("/stable-requests") ||
    location.pathname.includes("/notifications");

  // Hide back and notification button on the following paths
  const hideBackButton = location.pathname.includes("/stable-onboarding");

  // Get notification count from mock json data
  const { notifications } = mockNotificationsData;
  const unreadCount = notifications.filter((n) => !n.read).length;

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
          className="absolute right-0 top-2 border-0 text-primary"
          aria-label="Close"
        >
          <CloseIcon size={30} strokeWidth={2} className="text-primary" />
        </Button>
      ) : (
        !hideBackButton && (
          <Link
            to={ROUTES.NOTIFICATIONS} // Open notification
            aria-label="Notifikationer"
            className="absolute right-4 top-4 border-0 text-primary"
          >
            <div className="relative">
              <NotificationIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 bg-error-500 rounded-full text-white text-xs flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </Link>
        )
      )}
    </div>
  );
}
