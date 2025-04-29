import React from "react";
import ModalHeader from "../../layout/ModalHeader";

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
      <ModalHeader title={dayName} showCloseBtn={true} onCloseClick={onClose} />
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
