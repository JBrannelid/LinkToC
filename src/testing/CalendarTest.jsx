import Calendar from "../components/calendar/Calendar";
import EventItem from "../components/calendar/CalendarEventItem";
import eventData from "../testing/eventTestData.json";

export default function CalendarTest() {
  return (
    <div className="flex-1">
      <Calendar
        events={eventData.events} // Test .json data
        eventItemRenderer={EventItem} // Rendering Component
        noEventsMessage="Inga schemalagda händelser idag"
      />
    </div>
  );
}

/* Test page for Calendar. Acceptible Props
  events = [],
  locale = sv,
  noEventsMessage = "Inga schemalagda händelser",
  eventItemRenderer = EventItem,
*/
