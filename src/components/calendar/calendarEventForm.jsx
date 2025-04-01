import React, { useState } from "react";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";

const EventItem = ({ event }) => {
  const startDateTime = new Date(event.startDatetime);
  const endDateTime = new Date(event.endDatetime);
  const [showOptions, setShowOptions] = useState(false);

  // Use a default image if event.imageUrl is not provided
  const imageUrl = event.imageUrl || "/api/placeholder/40/40";

  return (
    <li className="flex items-center px-2 py-2 space-x-4 focus-within:bg-gray-100 hover:bg-gray-100">
      <img
        src={imageUrl}
        alt="Event related image"
        className="h-10 w-10 mx-auto object-cover rounded-full"
      />
      <div className="flex-auto pl-2">
        <p className="text-gray-900">{event.name}</p>
        <p className="mt-1">
          <time dateTime={event.startDatetime}>
            {format(startDateTime, "HH:mm")}
          </time>{" "}
          -{" "}
          <time dateTime={event.endDatetime}>
            {format(endDateTime, "HH:mm")}
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

        {showOptions && (
          <div className="absolute right-0 z-10 mb-2 bg-white rounded-md shadow-lg w-25 border-1">
            <div className="p-0.5">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Redigera", event.id);
                  setShowOptions(false);
                }}
              >
                Redigera
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Ta bort", event.id);
                  setShowOptions(false);
                }}
              >
                Ta bort
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default EventItem;
