import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import { useStableData } from "../../hooks/useStableData";
import LoadingSpinner from "../ui/LoadingSpinner";
import ModalHeader from "./ModalHeader";

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

  {
    /* stable info, green 
            Address, Sum of Horses, Stable for? e.g. Ridskola, Total of members, total Boxes in stable

            Address, BoxCount
        */
  }
  return (
    <>
      {stableInfo ? (
        <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
          {/* Header */}
          <div className="bg-primary-light">
            <ModalHeader title={stableInfo.name} />

            {/* stable info body */}
            <ol>
              <li>{stableInfo.type}</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
          {/* Header */}
          <div className="bg-primary-light">
            <ModalHeader title={`Error: ${error}`} />
            <p>Gärna Kontakta KundService!</p>
          </div>
        </div>
      )}
    </>
  );
}
