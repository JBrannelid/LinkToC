import React from "react";
import Card, { CardBody, CardSubtitle } from "../ui/card";
import {
  formatHorseAge,
  getHorseProfileImageUrl,
  getHorseFullName,
  getHorseImageAltText,
  getHorseOwnerName,
  getHorseColor,
} from "../../utils/horseProfileUtils";

const StableHorseCard = ({ horse, onClick }) => {
  const horseProfileImageUrl = getHorseProfileImageUrl(horse);
  const horseFullName = getHorseFullName(horse);
  const horseColor = getHorseColor(horse);
  const horseOwnerName = getHorseOwnerName(horse);

  return (
    <Card.Container
      className="cursor-pointer flex px bg-white border-1 border-primary rounded-xl overflow-hidden shadow-lg"
      onClick={onClick}
    >
      <div className="flex-1 rounded-full border-2 border-primary h-24 w-45 overflow-hidden m-2 my-4  lg:w-full lg:h-30 lg:rounded-none">
        <img
          src={horseProfileImageUrl}
          alt={getHorseImageAltText(horse)}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-auto ml-1 m-4">
        <Card.Title className="text-xs !text-start">{horseFullName}</Card.Title>
        <CardSubtitle className="text-xs !text-start">
          <p>{horseColor}</p>
          <p>{horseOwnerName}</p>
        </CardSubtitle>
      </div>
    </Card.Container>
  );
};

export default StableHorseCard;

// export default function StableHorseCard() {
//   const horseProfileImageUrl = getHorseProfileImageUrl();

//   return (
//     <div className="flex px my-4 mx-12 bg-white border-1 border-primary rounded-xl overflow-hidden shadow-lg">
//       <div className="flex-1 rounded-full border-2 border-primary overflow-hidden m-2 my-4 h-24">
//         <img src={getHorseProfileImageUrl} alt={getHorseImageAltText} />
//       </div>

//       <div className="flex-auto ml-1 m-4">
//         <h4 className="mb-1">{getHorseFullName}</h4>
//         <p className="mb-0.5">{formatHorseAge}</p>
//         <p className="mb-0.5">{getHorseBreed}</p>
//         <p className="mb-0.5">{getHorseOwnerName}</p>
//       </div>
//     </div>
//   );
// }
