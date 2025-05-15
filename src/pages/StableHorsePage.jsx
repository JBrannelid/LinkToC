import React, { use, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useStableHorses } from "../hooks/useStableHorses";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import ModalHeader from "../components/layout/ModalHeader";
import StableInfo from "../components/layout/StableInfo";
import { ROUTES, buildRoute } from "../routes/routeConstants";
import SearchIcon from "../assets/icons/SearchIcon";
import StableHorseCard from "../components/layout/StableHorseCard";

function StableHorsePage() {
  const { stableId: urlStableId } = useParams();
  const { currentStable } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // StableId from context or URL params
  const stableId = urlStableId || currentStable?.id;
  const { stableHorses, loading, error, loadingState } =
    useStableHorses(stableId);

  // Filter horses based on search term
  const filteredHorses = stableHorses.filter((horse) => {
    const horseName = horse.name?.toLowerCase() || "";
    return searchTerm === "" || horseName.includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  const handleHorseClick = (horseId) => {
    navigate(buildRoute(ROUTES.HORSE_PROFILE, { horseId }));
  };

  //Show horses logged in user owns in stable
  //------------------------------------------------------------------------------------------
  // const handleMyHorseClick = () => {
  //   navigate(buildRoute(ROUTES.HORSE_PROFILE, { horseId: currentStable?.id }));
  // }
  //------------------------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="medium" className="text-gray" />
        <p className="ml-2">{loadingState?.getMessage()}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
      {/* Header */}
      <div className="bg-primary-light lg:bg-background">
        <ModalHeader />
      </div>

      {/* Stable Info */}
      <StableInfo stableId={stableId} />

      {/* Stable Horse List */}
      <div className="px-5 py-3 md:px-10 lg:px-30">
        {/* Search Bar */}
        <div className="mb-5 border-t border-b border-gray py-5 lg:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search horses..."
              className="w-full px-10 py-2 border border-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <SearchIcon className="w-5 h-5 text-primary" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* My horse */}
        <div className="mb-6 flex justify-center lg:hidden ">
          <Button
            type="secondary"
            className="w-full max-w-sm"
            onClick={() => handleHorseClick(currentStable?.id)}
          >
            My horse
          </Button>
        </div>

        {/* Horse List */}
        <div className="grid justify-center gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filteredHorses.map((horse, index) => (
            <StableHorseCard
              key={horse.id ?? `horse-${index}`}
              horse={horse}
              onClick={() => handleHorseClick(horse.id)}
            />
          ))}
        </div>

        {/* No horses found */}
        {filteredHorses.length === 0 && (
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray">No horses found</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default StableHorsePage;
