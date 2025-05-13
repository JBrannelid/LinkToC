import React from "react";

export default function StableHorseCard() {
  // const { stableHorse, setStableHorse } = useState("");

  return (
    <div className="flex px my-4 mx-12 bg-white border-1 border-primary rounded-xl overflow-hidden shadow-lg">
      <div className="flex-1 rounded-full border-2 border-primary overflow-hidden m-2 my-4 h-24">
        <img
          src="src\assets\images\profilePlaceholder.jpg"
          alt="Horse profile picture"
        />
      </div>

      <div className="flex-auto ml-1 m-4">
        <h4 className="mb-1">Name</h4>
        <p className="mb-0.5">Age</p>
        <p className="mb-0.5">Föräldrar</p>
        <p className="mb-0.5">Owner</p>
      </div>
    </div>
  );
}
