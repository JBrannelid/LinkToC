import { enUS } from "date-fns/locale";
import React from "react";
import Calendar from "./calendar";
import { useAppContext } from "../../context/AppContext";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import { useStableData } from "../../hooks/useStableData";
import LoadingSpinner from "../ui/LoadingSpinner";

function CalendarDisplay() {
  const { currentStable } = useAppContext();

  // Custom hooks for data fetching
  const {
    stableId,
    status: stableStatus,
    loadingState: stableLoadingState,
  } = useStableData(currentStable.id);

  const {
    events,
    calendarStatus,
    loadingState: calendarLoadingState,
    getEventsForDay,
  } = useCalendarEvents(stableId || currentStable.id);

  // Loading state
  if ((calendarStatus.loading && events.length === 0) || stableStatus.loading) {
    return (
      <div className="py-2 text-gray flex items-center justify-center">
        <LoadingSpinner size="medium" className="text-gray" />
        <p>
          {stableStatus.loading
            ? stableLoadingState.getMessage()
            : calendarLoadingState.getMessage()}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 bg-background">
      <Calendar
        stableId={stableId || currentStable.id}
        events={events}
        locale={enUS}
        getEventsForDay={getEventsForDay}
      />
    </div>
  );
}

export default CalendarDisplay;
