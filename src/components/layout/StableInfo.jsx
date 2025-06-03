import React, { useEffect, useMemo } from "react";
import ModalHeader from "./ModalHeader";
import HorseBoxIcon from "../../assets/icons/HorseBoxIcon";
import HorseFaceIcon from "../../assets/icons/HorseFaceIcon";
import HorseRidingIcon from "../../assets/icons/HorseRidingIcon";
import LocationPinIcon from "../../assets/icons/LocationPinIcon";
import PeopleIcon from "../../assets/icons/PeopleIcon";
import SearchIcon from "../../assets/icons/SearchIcon";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useStableData } from "../../hooks/useStableData";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function StableInfo({
  stableId,
  searchTerm = "",
  onSearchChange = () => {},
  searchPlaceholder = "Search...",
}) {
  const { currentStable } = useAppContext();
  const targetStableId = stableId || currentStable?.id;

  const {
    status: { loading, error },
    getById,
    stableInfo,
    loadingState,
  } = useStableData(targetStableId);

  useEffect(() => {
    if (targetStableId) {
      getById();
    }
  }, [targetStableId, getById]);

  // Memoize the loading component to prevent unnecessary re-renders
  const LoadingComponent = useMemo(
    () => (
      <div className="bg-primary-light lg:bg-background">
        {/* Mobile loading with consistent header structure */}
        <div className="lg:hidden">
          <ModalHeader className="bg-primary-light" title="Loading..." />
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="medium" className="text-gray" />
            <span className="ml-2">{loadingState.getMessage()}</span>
          </div>
        </div>

        {/* Desktop loading with consistent header structure */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-center py-6">Loading...</h1>
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="medium" className="text-gray" />
            <span className="ml-2">{loadingState.getMessage()}</span>
          </div>
        </div>
      </div>
    ),
    [loadingState]
  );

  // Memoize the error component to prevent unnecessary re-renders
  const ErrorComponent = useMemo(
    () => (
      <div className="bg-primary-light lg:bg-background">
        {/* Mobile error with consistent header structure */}
        <div className="lg:hidden">
          <ModalHeader className="bg-primary-light" title="Error" />
          <div className="p-4 text-center">
            <p className="text-gray mb-2">
              We couldn't load the stable information at this time.
            </p>
            <p className="text-error-500 text-sm">{error}</p>
          </div>
        </div>

        {/* Desktop error with consistent header structure */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-center py-6">Error</h1>
          <div className="p-4 text-center">
            <p className="text-gray mb-2">
              We couldn't load the stable information at this time.
            </p>
            <p className="text-error-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    ),
    [error]
  );

  // Show loading state with consistent structure
  if (loading) {
    return LoadingComponent;
  }

  // Show error state with consistent structure
  if (error) {
    return ErrorComponent;
  }

  // Show stable info if available
  if (stableInfo) {
    return (
      <div className="bg-primary-light lg:bg-background">
        {/* Mobile layout */}
        <div className="lg:hidden">
          <ModalHeader className="bg-primary-light" title={stableInfo.name} />

          <div className="px-5 pb-3">
            <div className="grid grid-cols-2 gap-2">
              {/* First row */}
              <div className="col-span-2 flex items-center pl-[11%] sm:pl-[17%] md:pl-[20%] ">
                {/* Location */}
                <div className="flex items-center">
                  <LocationPinIcon
                    className="w-5 h-5 mr-2 text-primary"
                    size={29}
                  />
                  <span className="font-normal">{stableInfo.address}</span>
                </div>
              </div>

              {/* Second row - UNCHANGED */}
              <div className="flex justify-center items-center ">
                <HorseFaceIcon
                  className="w-5 h-5 mr-2 text-primary"
                  size={25}
                />
                <span className="font-normal">
                  Horses {stableInfo.horseCount}
                </span>
              </div>

              <div className="flex justify-center items-center">
                <HorseRidingIcon
                  className="w-5 h-5 mr-2 text-primary"
                  size={25}
                />
                <span className="font-normal">{stableInfo.type}</span>
              </div>

              {/* Third row - UNCHANGED */}
              <div className="flex justify-center items-center ml-7">
                <PeopleIcon className="w-5 h-5 mr-2 text-primary" size={24} />
                <span className="font-normal">
                  Members {stableInfo.memberCount}
                </span>
              </div>

              <div className="flex justify-center items-center mr-10">
                <HorseBoxIcon className="w-5 h-5 mr-2 text-primary" size={25} />
                <span className="font-normal">Boxes {stableInfo.boxCount}</span>
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
              <HorseFaceIcon className="w-5 h-5 mr-2 text-primary" size={21} />
              <span className="text-xs">Horses {stableInfo.horseCount}</span>
            </div>

            <div className="flex items-center">
              <PeopleIcon className="w-5 h-5 mr-2 text-primary" size={21} />
              <span className="text-xs">Members {stableInfo.memberCount}</span>
            </div>

            <div className="flex items-center">
              <HorseBoxIcon className="w-5 h-5 mr-2 text-primary" size={21} />
              <span className="text-xs">Boxes {stableInfo.boxCount}</span>
            </div>

            <div className="flex items-center">
              <HorseRidingIcon
                className="w-5 h-5 mr-2 text-primary"
                size={21}
              />
              <span className="text-xs">Riding school</span>
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
                <SearchIcon className="w-5 h-5 text-primary" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Centered border */}
          <div className="flex justify-center">
            <div className="border-b border-gray w-11/12"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no stable info is available
  return (
    <div className="bg-primary-light lg:bg-background">
      {/* Mobile fallback */}
      <div className="lg:hidden">
        <ModalHeader className="bg-primary-light" title="No Stable Selected" />
        <div className="p-4 text-center">
          <p className="text-gray">
            Please select a stable to view information.
          </p>
        </div>
      </div>

      {/* Desktop fallback */}
      <div className="hidden lg:block">
        <h1 className="text-xl font-semibold text-center py-6">
          No Stable Selected
        </h1>
        <div className="p-4 text-center">
          <p className="text-gray">
            Please select a stable to view information.
          </p>
        </div>
      </div>
    </div>
  );
}
