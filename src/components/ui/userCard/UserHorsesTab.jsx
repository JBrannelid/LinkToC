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
    <div className="">
      {horses.map((horse) => (
        <StableHorseCard
          key={`horse-${horse.horseId}`}
          horse={horse}
          className="!border-1 !shadow-md !mx-4"
          imageClassName="!rounded-full !border-primary"
          contentClassName="!ml-2 mt-8 "
        />
      ))}
    </div>
  );
};

export default UserHorsesTab;
