import Calendar from "./components/calendar/calendar";

function App() {
  return (
    <>
      <div className="flex">
        <div className="flex-wrap bg-amber-300 border-2 border-cyan-100 border-r">
          <h1 className="text-bg-secondary">Hello World</h1>
          <Calendar
            events={enhancedEvents}
            accentColor="bg-green-500"
            textColor="text-primary-text"
            noEventsMessage="Inga schemalagda händelser idag"
          />
        </div>
      </div>
    </>
  );
}

export default App;
