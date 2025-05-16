import React from "react";
import Card from "../ui/card";

const StableHorseCard = ({ horse, onClick }) => {
  const horseProfileImageUrl =
    horse?.HorseImageUrl || "/src/assets/images/testhorseimg.png";
  const horseFullName = horse?.horseName || "Unknown Horse";
  const horseColor = horse?.horseColor || "";
  const horseOwners = horse?.horseOwners || [];

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
        {Array.isArray(horseOwners) && horseOwners.length > 0 ? (
          <Card.Subtitle className="text-xs !text-start">
            {horseOwners.join(", ")} (owner{horseOwners.length > 1 ? "s" : ""})
          </Card.Subtitle>
        ) : horseOwners && typeof horseOwners === "string" ? (
          <Card.Subtitle className="text-xs !text-start">
            {horseOwners} (owner)
          </Card.Subtitle>
        ) : null}
      </div>
    </Card.Container>
  );
};

export default StableHorseCard;
