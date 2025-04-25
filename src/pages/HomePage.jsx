import React from "react";
import DisplayCalendar from "../components/calendar/CalendarDisplay";
import Wallpage from "../components/layout/WallPage";

export default function HomePage() {
  return (
    <div className="pb-24">
      <section>
        <DisplayCalendar />
      </section>
      <section>
        <Wallpage />
      </section>
    </div>
  );
}
