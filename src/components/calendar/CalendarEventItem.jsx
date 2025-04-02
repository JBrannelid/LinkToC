import React, { useState } from "react";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { parseISO } from "../../utils/calendarUtils";

const CalendarEventItem = ({ event }) => {
  const [showOptions, setShowOptions] = useState(false);

  // Use a default image if imageUrl is not provided
  const imageUrl =
    event.imageUrl ||
    "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9yc2V8ZW58MHx8MHx8fDA%3D";

  return (
    <li className="flex items-center px-2 py-2 space-x-4 focus-within:bg-gray-100 hover:bg-gray-100">
      {/* Event item of Image, Title and Time */}
      <img
        src={imageUrl}
        alt="Event related image" // Need to edit alt text or apply aria-label/describedby depending on the img functions
        className="h-10 w-10 mx-auto object-cover rounded-full"
      />
      <div className="flex-auto pl-2">
        <p className="text-gray-900">{event.Title}</p>
        <p className="mt-1">
          <time dateTime={event.StartDatetime}>
            {format(parseISO(event.StartDatetime), "HH:mm")}
          </time>{" "}
          -{" "}
          <time dateTime={event.EndDatetime}>
            {format(parseISO(event.EndDatetime), "HH:mm")}
          </time>
        </p>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-1.5 text-gray-500 hover:text-gray-600"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {/* Event edit modules */}
        {showOptions && (
          <div className="absolute right-0 z-10 mb-2 bg-white rounded-md shadow-lg w-25 border-1">
            <div className="p-0.5">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowOptions(false)}
                aria-label={`Edit event ${event.id}`}
              >
                <p> Redigera </p>
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowOptions(false)}
                aria-label={`Remove event ${event.id}`}
              >
                <p> Radera </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default CalendarEventItem;
