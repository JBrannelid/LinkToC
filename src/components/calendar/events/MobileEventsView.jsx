import React from "react";
import EventsHeader from "./EventsHeader";
import EventsList from "./EventsList";
import AddEventButton from "./AddEventButton";

const MobileEventsView = ({
  selectedDay,
  events,
  format,
  locale,
  noEventsMessage,
  onUpdateEvent,
  onDeleteEvent,
  onAddEvent,
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  const formattedDate = format(selectedDay, "EEEE, MMMM d", { locale });

  return (
    <div className="flex flex-col fixed inset-0 bg-white z-20 shadow-lg rounded-md overflow-hidden">
      <EventsHeader
        selectedDay={selectedDay}
        dayName={formattedDate}
        formattedDate={formattedDate}
        format={format}
        onClose={onClose}
        viewMode="mobile"
      />

      <div className="flex-1 overflow-y-auto">
        <EventsList
          events={events}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
          noEventsMessage={noEventsMessage}
        />
      </div>

      <AddEventButton onClick={onAddEvent} />
    </div>
  );
};

export default MobileEventsView;
