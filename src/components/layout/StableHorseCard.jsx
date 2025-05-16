import React from "react";
import Card, { CardSubtitle } from "../ui/card";
import {
  getHorseProfileImageUrl,
  getHorseImageAltText,
  formatHorseAge,
} from "../../utils/horseProfileUtils";
import { useHorseProfile } from "../../hooks/useHorseProfile";

const StableHorseCard = ({ horse, onClick }) => {
  const horseId = horse.id || horse.horseId || horse.HorseId;
  const { horse: horseProfile, loading } = useHorseProfile(horseId);

  const displayHorse = horseProfile || horse;
  const horseName = displayHorse.name || "Unknown Horse";
  const horseProfileImageUrl = getHorseProfileImageUrl(displayHorse);
  const horseColor = displayHorse.color || "";
  const horseBreed = displayHorse.breed || "";
  const ageValue = displayHorse.age || "";
  const horseAge = ageValue ? formatHorseAge(ageValue) : "";

  return (
    <Card.Container className="cursor-pointer" onClick={onClick}>
      <div className="p-2 flex flex-col">
        <div className="flex justify-center">
          <div className="w-24 h-24 mb-2 rounded-full overflow-hidden border-2 border-primary lg:w-full lg:h-30 lg:rounded-md">
            <img
              src={horseProfileImageUrl}
              alt={getHorseImageAltText(displayHorse)}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <Card.Title className="text-xs !text-start">{horseName}</Card.Title>
        <CardSubtitle className="text-xs !text-start">
          {horseColor && <p>{horseColor}</p>}
          {horseBreed && <p>{horseBreed}</p>}
          {horseAge && <p>{horseAge}</p>}
        </CardSubtitle>
      </div>
    </Card.Container>
  );
};

export default StableHorseCard;
