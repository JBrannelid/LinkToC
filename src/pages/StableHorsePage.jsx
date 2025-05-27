import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import SearchIcon from "../assets/icons/SearchIcon";
import ModalHeader from "../components/layout/ModalHeader";
import StableHorseCard from "../components/layout/StableHorseCard";
import StableInfo from "../components/layout/StableInfo";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext.js";
import { useStableHorses } from "../hooks/useStableHorses";
import { ROUTES, buildRoute } from "../routes/index.jsx";

function StableHorsePage() {
  const { stableId: urlStableId } = useParams();
  const { currentStable } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized StableId from context
  const stableId = useMemo(
    () => urlStableId || currentStable?.id,
    [urlStableId, currentStable?.id]
  );

  const { horses, loading, loadingState } = useStableHorses(stableId);

  // Memoize filtered horses
  const filteredHorses = useMemo(() => {
    if (!horses.length) return [];

    if (!searchTerm.trim()) return horses;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return horses.filter((horse) => {
      const horseName = horse.horseName?.toLowerCase() || "";
      return horseName.includes(lowerSearchTerm);
    });
  }, [horses, searchTerm]);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleHorseClick = useCallback(
    (horseId) => {
      navigate(buildRoute(ROUTES.HORSE_PROFILE, { horseId }));
    },
    [navigate]
  );

  const LoadingComponent = useMemo(
    () => (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="medium" className="text-gray" />
        <p className="ml-2">{loadingState?.getMessage()}</p>
      </div>
    ),
    [loadingState]
  );

  if (loading) {
    return LoadingComponent;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
      {/* Header */}
      <div className="bg-primary-light lg:bg-background">
        <ModalHeader />
      </div>

      {/* Stable Info */}
      <StableInfo
        stableId={stableId}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search..."
      />

      {/* Horse List */}
      <div className="px-5 py-3 md:px-10 lg:px-40 xl:px-60 pt-2 lg:pt-10">
        {/* Search Bar */}
        <div className="mb-5 border-t border-b border-gray py-5 lg:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-10 py-2 border border-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <SearchIcon className="w-5 h-5 text-primary" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Profile Btn */}
        <div className="mb-6 flex justify-center lg:hidden ">
          <Button
            type="secondary"
            className="w-full max-w-sm"
            onClick={() => handleHorseClick(currentStable?.id)}
          >
            My horse
          </Button>
        </div>

        {/* Horses Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">
          {filteredHorses.map((horse, index) => (
            <StableHorseCard
              key={horse.id ?? `horse-${index}`}
              horse={horse}
              onClick={() =>
                handleHorseClick(horse.id || horse.horseId || horse.HorseId)
              }
            />
          ))}
        </div>

        {filteredHorses.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray">No horses found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StableHorsePage;
