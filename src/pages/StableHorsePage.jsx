import { motion } from "framer-motion";
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
    <motion.div
      className="flex flex-col min-h-screen bg-background pb-35 overflow-y-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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
        <motion.div
          className="mb-6 flex justify-center lg:hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            type="secondary"
            className="w-full max-w-sm"
            onClick={() => handleHorseClick(currentStable?.id)}
          >
            My horse
          </Button>
        </motion.div>

        {/* Horses Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {filteredHorses.map((horse, index) => (
            <motion.div
              key={horse.id ?? `horse-${index}`}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{
                y: -2,
                scale: 1.02,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <StableHorseCard
                horse={horse}
                onClick={() =>
                  handleHorseClick(horse.id || horse.horseId || horse.HorseId)
                }
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredHorses.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray">No horses found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StableHorsePage;
