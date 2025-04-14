import React, { useState } from "react";
import StableName from "../components/home/StableName";
import Calendar from "../components/calendar/calendar";

export default function Home() {
  //stable id
  const id = 1;
  // const [id, setId] = useState();
  // const { input, setInput } = useState(0);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setId(Number(input));
  // };

  return (
    <>
      {/* <form>
        <label>
          Enter Stable ID:
          <input
            type="number"
            value={input}
            onChange={(i) => setInput(i.target.valueAsNumber)}
          />
        </label>
        <button type="submit">Load Stable</button>
      </form> */}

      <StableName id={id} />
      <div>Important Notice!!</div>
      <div>
        <Calendar />
      </div>
      <nav>navigation bar</nav>
    </>
  );
}
