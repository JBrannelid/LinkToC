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
      <div className="bg-primary-light pb-5">
        <ModalHeader
          showCloseBtn={true}
          onCloseClick={onClose}
          className="bg-primary-light"
          render="left"
        />
        <h1 className="text-center text-xl uppercase mt-5">{dayName}</h1>
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
