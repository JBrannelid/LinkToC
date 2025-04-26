import React from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";

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
      <div className="relative bg-primary-light py-5">
        <Button
          variant="icon"
          className="absolute left-4 top-4 border-0 text-primary"
          aria-label="Close list of events"
          onClick={onClose}
        >
          <X strokeWidth={4} />
        </Button>

        <h1 className="text-center text-xl font-semibold uppercase">
          {dayName}
        </h1>
      </div>
    );
  }

  // Fallback header (md display an above). Remove close button
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-semibold text-black">
        Schema för&nbsp;
        <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
          {formattedDate}
        </time>
      </h2>
    </div>
  );
};

export default EventsHeader;
