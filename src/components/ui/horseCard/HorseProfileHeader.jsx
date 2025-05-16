import React from "react";
import {
  getHorseProfileImageUrl,
  formatHorseAge,
} from "../../../utils/horseProfileUtils";
import Button from "../../ui/Button";

const HorseProfileHeader = ({ horse, horseProfile }) => {
  const enhancedHorse = horseProfile?.horse || horse;
  const horseName = enhancedHorse.name || "Unnamed Horse";
  const horseImageUrl = getHorseProfileImageUrl(enhancedHorse);
  const horseColor = enhancedHorse.color || "Unknown color";
  const horseAge = formatHorseAge(enhancedHorse.age);
  const horseBreed = enhancedHorse.breed || "Unknown breed";
  const stablePlace = enhancedHorse.stablePlace || "";
  const weight = enhancedHorse.weight || "";
  const length = enhancedHorse.length || "";

  return (
    <>
      {/* Desktop header */}
      <div className="hidden lg:block lg:px-40 xl:px-60 pt-8">
        <div className="flex justify-between items-start">
          {/* Horse info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-heading font-semibold">{horseName}</h1>
            <p className="text-sm text-gray">{horseAge}</p>
            <p className="text-sm text-gray">{horseBreed}</p>
            <p className="text-sm text-gray">{horseColor}</p>
          </div>

          {/* Horse stats buttons */}
          <div className="flex flex-row gap-2 mr-5 mt-10">
            <Button
              type="secondary"
              className="rounded-lg !border-primary flex flex-col max-h-15"
              aria-label="Stable Place"
            >
              <span className="text-primary mb-1">Box</span>
              <span className="text-xs">{stablePlace}</span>
            </Button>

            <Button
              type="secondary"
              className="rounded-lg !border-primary flex flex-col max-h-15"
              aria-label="Weight"
            >
              <span className="text-primary mb-1">Weight</span>
              <span className="text-xs">{weight}</span>
            </Button>

            <Button
              type="secondary"
              className="rounded-lg !border-primary flex flex-col max-h-15"
              aria-label="Length"
            >
              <span className="text-primary mb-1">Length</span>
              <span className="text-xs">{length}</span>
            </Button>
          </div>
        </div>

        {/* Image carousel */}
        <div className="relative mt-4 border-2 border-primary rounded-lg overflow-hidden">
          <div className="w-full h-55 relative">
            <img
              src={horseImageUrl}
              alt={`Image of ${horseName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden relative">
        {/* Horse image */}
        <div className="w-full sm:h-100 h-90 md:h-130">
          <img
            src={horseImageUrl}
            alt={`Image of ${horseName}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Horse info */}
        <div className="px-4 sm:px-6 md:px-8 py-6 bg-background rounded-t-3xl -mt-8 relative z-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-heading font-semibold">{horseName}</h1>
            <p className="text-sm text-gray">{horseAge}</p>
            <p className="text-sm text-gray">{horseBreed}</p>
            <p className="text-sm text-gray">{horseColor}</p>
          </div>

          <div className="flex justify-start gap-2 mt-6 md:justify-center md:px-20">
            {/* Mobile buttons */}
            <div className="flex flex-col items-center w-full md:w-9/10">
              <Button
                type="secondary"
                className="w-full h-13 md:h-12 !bg-primary-light !border-primary rounded-xl"
                aria-label="Stable Place"
              >
                <span className="text-primary">Box</span>
              </Button>
              <span className="mt-1 text-xs text-center text-primary">
                {stablePlace}
              </span>
            </div>

            <div className="flex flex-col items-center w-full md:w-9/10">
              <Button
                type="secondary"
                className="w-full h-13 md:h-12 !bg-primary-light !border-primary rounded-xl"
                aria-label="Weight"
              >
                <span className="text-primary">Weight</span>
              </Button>
              <span className="mt-1 text-xs text-center text-primary">
                {weight}
              </span>
            </div>

            <div className="flex flex-col items-center w-full md:w-9/10">
              <Button
                type="secondary"
                className="w-full h-13 md:h-12 !bg-primary-light !border-primary rounded-xl"
                aria-label="Length"
              >
                <span className="text-primary">Length</span>
              </Button>
              <span className="mt-1 text-xs text-center text-primary">
                {length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HorseProfileHeader;
