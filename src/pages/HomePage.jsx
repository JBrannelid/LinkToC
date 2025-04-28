import React from "react";
import DisplayCalendar from "../components/calendar/CalendarDisplay";
import WallPost from "../components/posts/WallPost";

export default function HomePage() {
  return (
    <div className="pb-24">
      <section>
        <DisplayCalendar />
      </section>
      <section>
        <WallPost />
      </section>
    </div>
  );
}
