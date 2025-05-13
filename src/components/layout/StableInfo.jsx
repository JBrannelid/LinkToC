import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import { useStableData } from "../../hooks/useStableData";
import LoadingSpinner from "../ui/LoadingSpinner";
import ModalHeader from "./ModalHeader";
import HorseRidingIcon from "../../assets/icons/HorseRidingIcon";
import HorseFaceIcon from "../../assets/icons/HorseFaceIcon";
import HorseBoxIcon from "../../assets/icons/HorseBoxIcon";
import LocationPinIcon from "../../assets/icons/LocationPinIcon";
import PeopleIcon from "../../assets/icons/PeopleIcon";
import SearchIcon from "../../assets/icons/SearchIcon";

export default function StableInfo({
  stableId,
  searchTerm = "",
  onSearchChange = () => {},
  searchPlaceholder = "Search...",
}) {
  const { currentStable } = useAppContext();
  const {
    status: { loading, error },
    getById,
    stableInfo,
    loadingState,
  } = useStableData(stableId || currentStable?.id);

  useEffect(() => {
    if (currentStable.id) {
      getById();
    }
  }, [currentStable?.id, getById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <span className="ml-2">{loadingState.getMessage()}</span>
      </div>
    );
  }

  if (error) {
    return <p>Error:{error.message}</p>;
  }

  return (
    <>
      {stableInfo ? (
        // Container
        <div className="bg-primary-light lg:bg-background">
          {/* Mobile layout */}
          <div className="lg:hidden">
            <ModalHeader className="bg-primary-light" title={stableInfo.name} />

            <div className="px-5 pb-3">
              <div className="grid grid-cols-2 gap-2">
                {/* First row */}
                <div className="flex justify-center items-center">
                  {/* Location */}
                  <div className="flex items-center mr-15">
                    <LocationPinIcon
                      className="w-5 h-5 mr-2 text-primary"
                      size={29}
                    />
                    <span className="font-normal">{stableInfo.address}</span>
                  </div>
                </div>

                {/* Empty cell to maintain grid */}
                <div className="invisible"></div>

                {/* Second row */}
                <div className="flex justify-center items-center ">
                  <HorseFaceIcon
                    className="w-5 h-5 mr-2 text-primary"
                    size={25}
                  />
                  <span className="font-normal">
                    Hästar {stableInfo.horseCount}
                  </span>
                </div>

                <div className="flex justify-center items-center">
                  <HorseRidingIcon
                    className="w-5 h-5 mr-2 text-primary"
                    size={25}
                  />
                  <span className="font-normal">{stableInfo.type}</span>
                </div>

                {/* Third row */}
                <div className="flex justify-center items-center ml-7">
                  <PeopleIcon className="w-5 h-5 mr-2 text-primary" size={24} />
                  <span className="font-normal">
                    Medlemar {stableInfo.memberCount}
                  </span>
                </div>

                <div className="flex justify-center items-center mr-10">
                  <HorseBoxIcon
                    className="w-5 h-5 mr-2 text-primary"
                    size={25}
                  />
                  <span className="font-normal">
                    Boxar {stableInfo.boxCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-center py-6">
              {stableInfo.name}
            </h1>

            <div className="flex items-center justify-center space-x-8 pb-4 px-4 mt-3">
              <div className="flex items-center">
                <LocationPinIcon
                  className="w-5 h-5 mr-2 text-primary"
                  size={24}
                />
                <span className="text-xs">{stableInfo.address}</span>
              </div>

              <div className="flex items-center">
                <HorseFaceIcon
                  className="w-5 h-5 mr-2 text-primary"
                  size={21}
                />
                <span className="text-xs">Hästar {stableInfo.horseCount}</span>
              </div>

              <div className="flex items-center">
                <PeopleIcon className="w-5 h-5 mr-2 text-primary" size={21} />
                <span className="text-xs">
                  Medlemar {stableInfo.memberCount}
                </span>
              </div>

              <div className="flex items-center">
                <HorseBoxIcon className="w-5 h-5 mr-2 text-primary" size={21} />
                <span className="text-xs">Boxar {stableInfo.boxCount}</span>
              </div>

              <div className="flex items-center">
                <HorseRidingIcon
                  className="w-5 h-5 mr-2 text-primary"
                  size={21}
                />
                <span className="text-xs">Ridskola</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-10 py-1 border border-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <SearchIcon
                    className="w-5 h-5 text-primary"
                    strokeWidth={3}
                  />
                </div>
              </div>
            </div>

            {/* Centered border */}
            <div className="flex justify-center">
              <div className="border-b border-gray w-11/12"></div>
            </div>
          </div>
        </div>
      ) : (
        // Error state
        <div className="bg-primary-light p-4 text-center">
          <ModalHeader title="Stable Information Unavailable" />
          <p className="text-gray mb-2">
            We couldn't load the stable information at this time.
          </p>
        </div>
      )}
    </>
  );
}
