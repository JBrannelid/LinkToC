import { useState } from "react";
import { sv } from "date-fns/locale";
import Calendar from "./Calendar";
import CalendarEventItem from "./CalendarEventItem";
import EventForm from "../forms/DataForm";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";

function CalendarDisplay() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const { events, status, createEvent, updateEvent, deleteEvent } =
    useCalendarEvents();

  // -----------   Form controls ----------- //
  const showEventEditorForm = () => {
    setIsFormOpen(true);
    setCurrentEvent(null);
  };

  const closeEventEditor = () => {
    setIsFormOpen(false);
    setCurrentEvent(null);
  };

  const showEventUpdateForm = (eventId) => {
    const selectedEventToEdit = events.find((event) => event.id === eventId); // Find the event by ID
    if (selectedEventToEdit) {
      setCurrentEvent(selectedEventToEdit);
      setIsFormOpen(true);
    }
  };

  // -----------  Event Handlers  ----------- //
  const createEventHandler = async (eventData) => {
    const success = await createEvent(eventData);
    if (success) closeEventEditor();
  };

  const updateEventHandler = async (eventData) => {
    const success = await updateEvent({
      ...eventData,
      id: currentEvent.id,
    });
    if (success) closeEventEditor();
  };

  // We need to implement a loading component
  if (status.loading && events.length === 0) {
    return (
      <div className="p-8 text-center">
        <p>Laddar kalender...</p>
      </div>
    );
  }

  // We need to implement a custom component for buttons, message ect....
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-2xl font-bold">Kalender</h1>
      </div>
      <div>
        <button
          onClick={showEventEditorForm}
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <p>Lägg till händelse</p>
        </button>
      </div>

      {status.loading && events.length > 0 && (
        <div className="text-center py-2 text-gray-500">Uppdaterar...</div>
      )}

      {status.error && (
        <div className="text-center py-2 text-red-500">{status.error}</div>
      )}

      {isFormOpen && (
        <EventForm
          event={currentEvent}
          onSubmit={currentEvent ? updateEventHandler : createEventHandler}
          onCancel={closeEventEditor}
        />
      )}
      <Calendar
        events={events}
        locale={sv}
        noEventsMessage="Inga schemalagda händelser"
        eventItemRenderer={({ event }) => (
          <CalendarEventItem
            event={event}
            onDelete={() => deleteEvent(event.id)}
            onUpdate={() => showEventUpdateForm(event.id)}
          />
        )}
      />
    </div>
  );
}

export default CalendarDisplay;
