import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import NotificationIcon from "../../assets/icons/NotificationIcon";
import Button from "../ui/Button";
import mockNotificationsData from "../../testing/mockNotifications.json";
import { getNotificationTypeStyles } from "../../utils/notificationUtils";

const NotificationCard = ({ notification }) => {
  const { type, title, message, timestamp } = notification;
  const { iconElement } = getNotificationTypeStyles(type);

  // Return notification card with mock json data
  return (
    <div className={`bg-white rounded-lg shadow-sm mb-3 p-2 `}>
      <div className="flex">
        <div className="mr-3">{iconElement}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-black">{title}</h3>
            <span className="text-xs text-gray ml-2">{timestamp}</span>
          </div>
          <p className="text-sm mt-1 text-black">{message}</p>
        </div>
      </div>
    </div>
  );
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications } = mockNotificationsData;
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside with event listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    // Prevent default to stop navigation
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleViewAll = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Btn - Absolute position notification count */}
      <Button
        type="icon"
        onClick={toggleDropdown}
        aria-label="View notifications"
      >
        <NotificationIcon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
        {unreadCount > 0 && (
          <span className="absolute -top-0 -right-0 w-5 h-5 bg-error-500 rounded-full text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute -right-10 z-50 w-100 max-h-[80vh] overflow-auto mt-7">
          <div className="bg-primary-light rounded-lg shadow-lg">
            <div className="p-4">
              {notifications.slice(0, 4).map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
            {/* View all link - Design as a btn */}
            <div className="flex justify-center">
              <div className="bg-primary p-2 text-center rounded-lg w-1/2 mb-2">
                <Link
                  to={ROUTES.NOTIFICATIONS}
                  className="text-white text-sm font-medium block no-underline"
                  onClick={handleViewAll}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
