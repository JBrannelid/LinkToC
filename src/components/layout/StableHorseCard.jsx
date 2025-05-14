import React from "react";
import Card from "../ui/card";
import {
  formatHorseAge,
  getHorseProfileImageUrl,
  getHorseFullName,
  getHorseImageAltText,
  getHorseOwnerName,
  getHorseBreed,
} from "../../utils/horseProfileUtils";

export default function StableHorseCard() {
  // const { stableHorse, setStableHorse } = useState("");
  const horseProfileImageUrl = getHorseProfileImageUrl();

  return (
    <div className="flex px my-4 mx-12 bg-white border-1 border-primary rounded-xl overflow-hidden shadow-lg">
      <div className="flex-1 rounded-full border-2 border-primary overflow-hidden m-2 my-4 h-24">
        <img src={getHorseProfileImageUrl} alt={getHorseImageAltText} />
      </div>

      <div className="flex-auto ml-1 m-4">
        <h4 className="mb-1">{getHorseFullName}</h4>
        <p className="mb-0.5">{formatHorseAge}</p>
        <p className="mb-0.5">{getHorseBreed}</p>
        <p className="mb-0.5">{getHorseOwnerName}</p>
      </div>
    </div>
  );
}
