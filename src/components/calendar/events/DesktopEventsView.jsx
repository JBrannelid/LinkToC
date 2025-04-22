import React from "react";
import EventsHeader from "./EventsHeader";
import EventsList from "./EventsList";
import AddEventButton from "./AddEventButton";

const DesktopEventsView = ({
  selectedDay,
  events,
  format,
  formatFullDayDate,
  locale,
  noEventsMessage,
  onUpdateEvent,
  onDeleteEvent,
  onAddEvent,
}) => {
  const dayName = format(selectedDay, "EEEE", { locale }).toUpperCase();
  const formattedDate = formatFullDayDate(selectedDay, locale);

  return (
    <section className="mt-2 md:mt-0">
      <EventsHeader
        selectedDay={selectedDay}
        dayName={dayName}
        formattedDate={formattedDate}
        format={format}
        viewMode="desktop"
      />

      <div className="mt-4">
        <EventsList
          events={events}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
          noEventsMessage={noEventsMessage}
        />
      </div>

      <AddEventButton onClick={onAddEvent} />
    </section>
  );
};

export default DesktopEventsView;
