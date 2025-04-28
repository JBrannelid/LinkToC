import React from "react";
import { X } from "lucide-react";
import { formatTimeOnly } from "../../../utils/calendarUtils";
import UserProfileImage from "../../common/UserProfileImage";

const EventItem = ({ event, index, onUpdate, onDelete }) => {
  // Background for even/odd events rows
  const bgColor = index % 2 === 0 ? "bg-white" : "bg-background";

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
      className={`flex items-center px-2 py-5 ${bgColor}`}
      onClick={handleItemClick}
    >
      {/* User image */}
      <div className="flex-shrink-0 mr-6">
        <UserProfileImage user={event.user} size="small" />
      </div>

      {/* Event Title */}
      <div className="flex-1">
        <p className="font-normal">{event.title}</p>

        {/* Display user name */}
        <p className="text-gray text-xs truncate">{userName}</p>
      </div>

      {/* Display time */}
      <div className="flex-shrink-0 text-right text-sm border border-primary rounded-lg px-2 py-1">
        kl {formatTimeOnly(event.startDateTime)}
        {/* –{" "}
        {formatTimeOnly(event.endDateTime)} */}
      </div>

      {/* Delete button */}
      {/* {onDelete && (
        <div className="relative ml-2">
          <button
            onClick={handleDeleteClick}
            className="p-2 text-red-500 hover:text-red-900"
            aria-label={`Delete event: ${event.title}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )} */}
    </li>
  );
};

export default EventItem;
