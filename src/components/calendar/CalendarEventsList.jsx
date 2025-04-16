import React from "react";

const CalendarEventsList = ({
  selectedDay,
  selectedDayEvents,
  format,
  formatFullDayDate,
  locale,
  noEventsMessage,
  eventItemRenderer,
}) => {
  return (
    <section className="mt-12 md:mt-0 md:pl-14">
      <h2 className="font-semibold text-gray-900">
        Schema för&nbsp;
        <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
          {formatFullDayDate(selectedDay, locale)}
        </time>
      </h2>
      {/* Map list of events */}
      <ol className="mt-4 text-sm leading-6 text-gray-500">
        {selectedDayEvents.length > 0 ? (
          selectedDayEvents.map((event) => (
            <React.Fragment key={event.id}>
              {React.createElement(eventItemRenderer, { event })}
            </React.Fragment>
          ))
        ) : (
          <p>{noEventsMessage}</p>
        )}
      </ol>
    </section>
  );
};

export default CalendarEventsList;
