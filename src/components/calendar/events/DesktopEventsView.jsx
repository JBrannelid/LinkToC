import React from "react";
import EventsHeader from "./EventsHeader";
import EventsList from "./EventsList";
import AddEventButton from "./AddEventButton";
import Button from "../../ui/Button";

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
  onBackToWall,
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

      {/* Row with both buttons */}
      <div className="mt-10 flex justify-between items-center">
        {/* Only show Back button if onBackToWall function is provided */}
        {onBackToWall && (
          <Button
            type="secondary"
            onClick={onBackToWall}
            className="flex-shrink-0"
          >
            <p>← Back to wall</p>
          </Button>
        )}
        <div className={onBackToWall ? "ml-auto" : ""}>
          <AddEventButton onClick={onAddEvent} />
        </div>
      </div>
    </section>
  );
};

export default DesktopEventsView;
