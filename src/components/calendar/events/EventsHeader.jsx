import React from "react";
import { X } from "lucide-react";

const EventsHeader = ({
  selectedDay,
  dayName,
  formattedDate,
  format,
  onClose,
  viewMode,
}) => {
  // Mobile header with close button
  if (viewMode === "mobile") {
    return (
      <div className="relative bg-gray-200 py-4 px-6">
        <button
          onClick={onClose}
          className="absolute left-4 top-2.5 p-2 rounded-full text-gray-900 hover:text-red-500"
          aria-label="Close list of events"
        >
          <X className="h-7 w-7" />
        </button>
        <h1 className="text-center text-xl font-semibold uppercase">
          {dayName}
        </h1>
      </div>
    );
  }

  // Fallback header. Don't need a close button
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-semibold text-gray-900">
        Schema för&nbsp;
        <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
          {formattedDate}
        </time>
      </h2>
    </div>
  );
};

export default EventsHeader;
