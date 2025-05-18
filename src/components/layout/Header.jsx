import React from "react";
import { Link, useLocation } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import SettingIcon from "../../assets/icons/SettingIcon";
import ChevronLeftIcon from "../../assets/icons/ChevronLeftIcon";
import NotificationIcon from "../../assets/icons/NotificationIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import Button from "../ui/Button";
import mockNotificationsData from "../../testing/mockNotifications.json";

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Show left btn if the current path is one of the following
  const showChevronLeft =
    currentPath.includes("/manage-horses") ||
    currentPath.includes("/manage-stable");

  // Show back button if the current path is one of the following
  const showBackButton = currentPath.includes("/notifications");

  // Hide back and notification button on the following paths
  const hideBackButton =
    currentPath.includes("/stable-onboarding") ||
    currentPath.includes("/manage-horses") ||
    currentPath.includes("/manage-stable") ||
    currentPath.includes("/stable-requests") ||
    currentPath.includes("/select-stable");

  // Get notification count from mock json data
  const { notifications } = mockNotificationsData;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative py-5 lg:hidden">
      {/* Left side */}
      {showChevronLeft ? (
        <Button
          onClick={() => window.history.back()}
          type="icon"
          className="absolute left-4 top-4 border-0 text-primary"
          aria-label="Back"
        >
          <ChevronLeftIcon className="w-5 h-5 md:w-8 md:h-8 text-primary" />
        </Button>
      ) : (
        <Link
          to={ROUTES.SETTINGS}
          aria-label="Settings"
          className="absolute left-4 top-4"
        >
          <SettingIcon
            strokeWidth={9}
            variant="icon"
            className="w-7 h-7 md:w-8 md:h-8 text-primary"
          />
        </Link>
      )}

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
            aria-label="Notifications"
            className="absolute right-4 top-4 border-0 text-primary"
          >
            <div className="relative">
              <NotificationIcon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
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
