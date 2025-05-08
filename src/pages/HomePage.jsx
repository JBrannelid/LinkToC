import React from "react";
import DisplayCalendar from "../components/calendar/CalendarDisplay";
import WallPost from "../components/posts/WallPost";

export default function HomePage() {
  return (
    <div className="mx-auto mb-0 mt-5 sm:mt-10 lg:mt-20 md:pb-24 lg:pb-10 px-4 md:px-6 lg:max-w-7xl">
      <section>
        <DisplayCalendar />
      </section>
      <section className="md:mt-10">
        <WallPost />
      </section>
    </div>
  );
}
