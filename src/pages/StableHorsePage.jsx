import React from "react";
import StableInfo from "../components/layout/StableInfo";
import StableHorseCard from "../components/layout/StableHorseCard";
import { useParams } from "react-router";
import { useAppContext } from "../context/AppContext";
import SearchIcon from "../assets/icons/SearchIcon";

function StableHorsePage() {
  const { currentStable } = useAppContext();
  const { stableId } = useParams();
  const stableIdFromContext = currentStable?.id || stableId;

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
        <StableInfo stableId={stableIdFromContext} />
        <div className="px-5 py-3 md:px-10 lg:px-30">
          {/* search */}
          <div className="mb-5 border-t border-b border-gray py-5 lg:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search horses..."
                className="w-full px-10 py-2 border border-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                //----------------------------------------------------------------------------------------------
                // NEEED TO ADAPT TO FUNCTIONALITY TO SEARCH HORSES
                // value={searchTerm}
                //----------------------------------------------------------------------------------------------
                // NEEED TO ADAPT TO FUNCTIONALITY TO SEARCH HORSES
                // onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-3 flex items-center">
                <SearchIcon className="w-5 h-5 text-primary" strokeWidth={3} />
              </div>
            </div>
          </div>
          {/* stable horse list */}
          <h2
            className="mb-6 flex justify-center lg:hidden w-full max-w-sm font-body border-1 shadow-lg rounded-lg bg-white p-3
           items-center transition-colors drop-shadow-md
           border-primary focus:ring-primary-light focus:outline-none focus:ring-3
           py-2 px-4 text-base font-medium"
          >
            Min Häst
          </h2>
          <StableHorseCard />
        </div>
      </div>
    </>
  );
}
export default StableHorsePage;
