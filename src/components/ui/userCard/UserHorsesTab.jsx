import React from "react";
import { useStableHorses } from "../../../hooks/useStableHorses";
import { useAppContext } from "../../../context/AppContext";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { useNavigate } from "react-router";
import { buildRoute, ROUTES } from "../../../routes/routeConstants";

const UserHorsesTab = ({ userId }) => {
  const { currentStable } = useAppContext();
  const navigate = useNavigate();
  const { horses, loading, error, loadingState } = useStableHorses(
    currentStable?.id
  );

  const handleHorseClick = (horseId) => {
    navigate(buildRoute(ROUTES.HORSE_PROFILE, { horseId }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <span className="ml-2">{loadingState.getMessage()}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-center text-error-500 py-4">{error}</p>
      </div>
    );
  }

  if (horses.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-center text-gray py-4">No horses available</p>
      </div>
    );
  }

  // Helper function to get the horse image URL
  const getHorseImageUrl1 = (horse) => {
    return horse?.imageUrl || "/src/assets/images/horsePlaceholder.jpg";
  };
  const getHorseImageUrl2 = (horse) => {
    return horse?.imageUrl || "/src/assets/images/testhorseimg.png";
  };

  return (
    <>
      {/* Custom Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 px-4">
        {horses.map((horse) => {
          // Extract horse data with fallback values
          const horseName = horse?.horseName || "Unnamed Horse";
          const horseColor = horse?.horseColor || "Unknown";
          const horseOwners =
            horse?.horseOwners?.length > 0
              ? horse.horseOwners.join(", ")
              : "No owner assigned";

          return (
            <div
              key={`horse-${horse.horseId}`}
              className="border border-primary rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleHorseClick(horse.horseId)}
            >
              <div className="w-full h-50">
                <img
                  src={getHorseImageUrl2(horse)}
                  alt={`Horse ${horseName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold">{horseName}</h3>
                <p className="text-gray text-sm">
                  Color: {horseColor}
                  <br />
                  Owner: {horseOwners}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* mobile layout */}
      <div className=" grid grid-row-1 gap-2 px-2 sm:grid sm:grid-cols-2 sm:gap-4 lg:hidden">
        {horses.map((horse) => {
          // Extract horse data with fallback values
          const horseName = horse?.horseName || "Unnamed Horse";
          const horseBirthYear = horse?.birthYear || "";
          const horseColor = horse?.horseColor || "Unknown";
          const horseOwners =
            horse?.horseOwners?.length > 0
              ? horse.horseOwners.join(", ")
              : "No owner assigned";

          return (
            <div className="mx-5 ">
              <div
                key={`horse-${horse.horseId}`}
                className="border border-primary rounded-lg overflow-hidden cursor-pointer flex h-30 max-h-35"
                onClick={() => handleHorseClick(horse.horseId)}
              >
                {/* Img */}
                <div className="w-50 h-auto">
                  <img
                    src={getHorseImageUrl1(horse)}
                    alt={`Horse ${horseName}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="w-full flex flex-col justify-center p-3">
                  <h3 className="font-bold truncate">{horseName}</h3>
                  <p className="text-gray text-sm">
                    {horseBirthYear && (
                      <span>
                        {horseBirthYear}
                        <br />
                      </span>
                    )}
                    Color: {horseColor}
                    <br />
                    Owner: {horseOwners}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserHorsesTab;
