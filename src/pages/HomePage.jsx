import React from "react";
import DisplayCalendar from "../components/calendar/CalendarDisplay";
import WallPost from "../components/posts/WallPost";

export default function HomePage() {
  return (
    <div className="mx-auto min-h-screen pb-20 md:pb-24 lg:pb-30 px-4 md:px-6 lg:px-8">
      <section className="mb-6 md:mb-8">
        <DisplayCalendar />
      </section>
      <section className="mx-auto mb-16 md:mb-10 lg:mb-6 md:mx-0 md:max-w-none">
        <WallPost />
      </section>
    </div>
  );
}
