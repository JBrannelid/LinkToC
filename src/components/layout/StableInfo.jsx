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

export default function StableInfo() {
  const { currentStable } = useAppContext();
  const {
    status: { loading, error },
    getById,
    stableInfo,
  } = useStableData(currentStable?.id);

  useEffect(() => {
    if (currentStable.id) {
      getById();
    }
  }, [currentStable?.id, getById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <span className="ml-2">Laddar...</span>
      </div>
    );
  }

  if (error) {
    return <p>Error:{error.message}</p>;
  }

  //  Lack several data!!!
  return (
    <>
      {stableInfo ? (
        // Header
        <div className="bg-primary-light">
          <ModalHeader className="bg-primary-light" title={stableInfo.name} />

          {/* stable info body */}
          <ol className="pb-3">
            <li className="m-1 mb-1">
              <p className="flex m-0.5">
                <LocationPinIcon
                  className="w-5 h-5 mr-2 text-primary"
                  size={24}
                />
                {stableInfo.address}
              </p>
            </li>
            <div className="grid grid-cols-2 gap-0.5">
              <li className="m-1">
                <p className="flex m-0.5 items-center">
                  <HorseFaceIcon
                    className="w-5 h-5 mr-3 text-primary"
                    size={24}
                  />
                  Hästar {stableInfo.horseCount}
                </p>
              </li>
              <li className="m-1">
                <p className="flex m-0.5 items-center">
                  <HorseRidingIcon
                    className="w-5 h-5 mr-3 text-primary mt-0.5"
                    size={24}
                  />
                  {stableInfo.type}
                </p>
              </li>
              <li className="m-1">
                <p className="flex m-0.5 items-center">
                  <PeopleIcon className="w-5 h-4 mr-3 text-primary" size={24} />
                  Medlemar {stableInfo.memberCount}
                </p>
              </li>
              <li className="m-1">
                <p className="flex m-0.5 items-center">
                  <HorseBoxIcon
                    className="w-5 h-5 mr-3 text-primary mt-0.5"
                    size={24}
                  />
                  Boxar {stableInfo.boxCount}
                </p>
              </li>
            </div>
          </ol>
        </div>
      ) : (
        //Header
        <div className="bg-primary-light">
          <ModalHeader title={`Error: ${error}`} />
          <p>Gärna Kontakta KundService!</p>
        </div>
      )}
    </>
  );
}
