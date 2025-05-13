import React from "react";
import Card from "../card";
import StableHorseCard from "../../stableHorse/StableHorseCard";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { useStableHorses } from "../../../hooks/useStableHorses";
import { useAppContext } from "../../../context/AppContext";

const UserHorsesTab = ({ userId }) => {
  const { currentStable } = useAppContext();
  const { horses, loading, error, loadingState } = useStableHorses(
    currentStable?.id
  );

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
      <Card.Container>
        <Card.Body>
          <p className="text-center text-error-500 py-4">{error}</p>
        </Card.Body>
      </Card.Container>
    );
  }

  if (horses.length === 0) {
    return (
      <Card.Container>
        <Card.Body>
          <p className="text-center text-gray py-4">No horses available</p>
        </Card.Body>
      </Card.Container>
    );
  }

  // Right now we display all stable horses since the API doesn't support filtering by owner yet
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:place-items-center">
      {horses.map((horse) => (
        <StableHorseCard
          key={`horse-${horse.horseId}`}
          horse={horse}
          className="mx-0 sm:mx-2 border border-primary shadow-md sm:grid sm:grid-cols-[auto_1fr] sm:items-center sm:gap-0.5"
          imageClassName="rounded-full sm:rounded-lg object-cover border border-primary w-20 h-25 sm:w-28 sm:h-28 md:w-35 md:h-35"
          contentClassName="ml-0 mt-4 sm:mt-0 py-2"
        />
      ))}
    </div>
  );
};

export default UserHorsesTab;
