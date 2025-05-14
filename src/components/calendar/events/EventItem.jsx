import React from "react";
import { formatTimeOnly } from "../../../utils/calendarUtils";
import UserProfileImage from "../../common/UserProfileImage";

const EventItem = ({ event, index, onUpdate }) => {
  // Background for even/odd events rows
  const bgColor = index % 2 === 0 ? "bg-background" : "bg-white ";

  // Get fullname or display unknown user
  const userFullName =
    [event.user?.firstName, event.user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Okänd Användare";

  const handleItemClick = () => {
    if (onUpdate) {
      onUpdate(event.id);
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
        <p className="text-gray text-xs truncate">{userFullName}</p>
      </div>

      {/* Display time */}
      <div className="flex-shrink-0 text-right text-sm border border-primary rounded-lg px-2 py-1">
        kl {formatTimeOnly(event.startDateTime)}
        {/* –{" "}
        {formatTimeOnly(event.endDateTime)} */}
      </div>
    </li>
  );
};

export default EventItem;
