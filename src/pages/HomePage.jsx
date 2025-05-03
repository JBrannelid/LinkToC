import React from "react";
import DisplayCalendar from "../components/calendar/CalendarDisplay";
import WallPost from "../components/posts/WallPost";

export default function HomePage() {
  return (
    <div className="h-screen pb-30">
      <section>
        <DisplayCalendar />
      </section>
      <section>
        <WallPost />
      </section>
    </div>
  );
}
