import React from "react";
import { X } from "lucide-react";
import { formatTimeOnly } from "../../../utils/calendarUtils";
import UserProfileImage from "../../common/UserProfileImage";

const EventItem = ({ event, index, onUpdate, onDelete }) => {
  // Background for even/odd events rows
  const bgColor =
    index % 2 === 0
      ? "bg-white hover:bg-green-50"
      : "bg-gray-100 hover:bg-green-50";

  // Get username or display unknown user
  const userName =
    [event.user?.firstName, event.user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    event.user?.userName ||
    "Okänd Användare";

  const handleItemClick = () => {
    if (onUpdate) {
      onUpdate(event.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(event.id);
    }
  };

  return (
    <li
      className={`flex items-center px-5 py-9 group rounded-md ${bgColor}`}
      onClick={handleItemClick}
    >
      {/* User image */}
      <div className="flex-shrink-0 mr-8">
        {event.user ? (
          <UserProfileImage user={event.user} size="medium" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-semibold">
            {event.title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Event details */}
      <div className="flex-1">
        <p className="text-gray-900 font-medium truncate">{event.title}</p>

        {/* Display user name */}
        <p className="text-gray-500 text-xs truncate">{userName}</p>
      </div>

      {/* Display time */}
      <div className="flex-shrink-0 text-right text-sm text-gray-600 w-24 ml-auto">
        {formatTimeOnly(event.startDateTime)} –{" "}
        {formatTimeOnly(event.endDateTime)}
      </div>

      {/* Delete button */}
      {onDelete && (
        <div className="relative ml-2">
          <button
            onClick={handleDeleteClick}
            className="p-2 text-red-500 hover:text-red-900"
            aria-label={`Delete event: ${event.title}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </li>
  );
};

export default EventItem;
