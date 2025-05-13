import React from "react";
import { getProfileImageUrl } from "../../utils/userUtils";

export default function StableHorseCard({ horse }) {
  // If no horse data was provided, use default placeholder values
  const horseName = horse?.horseName || "Name";
  const horseColor = horse?.horseColor || "Color";
  const horseOwners =
    horse?.horseOwners?.length > 0
      ? horse.horseOwners.join(", ")
      : "No owner assigned";

  // Use the horse's profile image URL if available, otherwise use a placeholder
  const profileImageUrl = getProfileImageUrl(
    horse?.profileImage,
    "/src/assets/images/profilePlaceholder.jpg"
  );

  return (
    <div className="flex px my-4 mx-12 bg-white border-1 border-primary rounded-xl overflow-hidden shadow-lg">
      <div className="flex-1 rounded-full border-2 border-primary overflow-hidden m-2 my-4 h-24">
        <img
          src={profileImageUrl}
          alt={`${horseName} profile picture`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-auto ml-1 m-4">
        <h4 className="mb-1">{horseName}</h4>
        <p className="mb-0.5">Color: {horseColor}</p>
        <p className="mb-0.5">Parents: {horse?.parents || "Unknown"}</p>
        <p className="mb-0.5">Owner: {horseOwners}</p>
      </div>
    </div>
  );
}
