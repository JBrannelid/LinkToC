import React from "react";
import EventItem from "./EventItem";

const EventsList = ({
  events,
  onUpdateEvent,
  onDeleteEvent,
  noEventsMessage,
}) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>{noEventsMessage}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 overflow-y-auto max-h-110 scrollbar-none">
      {events.map((event, index) => (
        <EventItem
          key={event.id}
          event={event}
          index={index}
          onUpdate={onUpdateEvent}
          onDelete={onDeleteEvent}
        />
      ))}
    </ul>
  );
};

export default EventsList;
