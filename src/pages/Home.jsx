import React, { useState } from "react";
import StableName from "../components/home/StableName";
import Calendar from "../components/calendar/calendar";

export default function Home() {
  //stable id
  const id = 1;

  return (
    <>
      <StableName id={id} />
      <div>Important Notice!!</div>
      <div>
        <Calendar />
      </div>
      <nav>navigation bar</nav>
    </>
  );
}
