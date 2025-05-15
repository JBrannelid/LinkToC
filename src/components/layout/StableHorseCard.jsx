import React from "react";
import Card from "../ui/card";

const StableHorseCard = ({ horse, onClick }) => {
  const horseProfileImageUrl =
    horse?.HorseImageUrl || "/src/assets/images/horsePlaceholder.jpg";
  const horseFullName = horse?.horseName || "Unknown Horse";
  const horseColor = horse?.horseColor || "";
  const horseOwners = Array.isArray(horse?.horseOwners)
    ? horse.horseOwners.join(", ")
    : horse?.horseOwners || "";

  return (
    <Card.Container className="cursor-pointer" onClick={onClick}>
      <div className="p-2 flex flex-col">
        <div className="flex justify-center">
          <div className="w-24 h-24 mb-2 rounded-full overflow-hidden border-2 border-primary lg:w-full lg:h-30 lg:rounded-md">
            <img
              src={horseProfileImageUrl}
              alt={`Horse ${horseFullName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <Card.Title className="text-xs !text-start">{horseFullName}</Card.Title>
        {horseColor && (
          <Card.Subtitle className="text-xs !text-start">
            {horseColor}
          </Card.Subtitle>
        )}
        {horseOwners && (
          <Card.Subtitle className="text-xs !text-start">
            {horseOwners}
          </Card.Subtitle>
        )}
      </div>
    </Card.Container>
  );
};

export default StableHorseCard;
