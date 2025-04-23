import React, { useState } from "react";
import StableName from "../components/home/StableName";
import Calendar from "../components/calendar/calendar";
import WallPost from "../components/home/WallPost";

export default function Home() {
  //stable id
  const id = 1;

  return (
    <>
      <StableName id={id} />
      <div>
        <Calendar />
      </div>
      <div>
        <WallPost />
      </div>
      <nav>navigation bar</nav>
    </>
  );
}
