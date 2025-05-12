import React from "react";
import StableInfo from "../components/layout/StableInfo";
import StableHorseCard from "../components/stableHorse/StableHorseCard";
function StableHorsePage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
        <StableInfo />
        <div>
          {/* search */}
          <div>Search bar</div>
          {/* stable horse list */}
          <h2 className="text-center border-1 border-primary shadow-lg rounded-lg bg-white p-3 mx-8 my-4">
            Min Häst
          </h2>
          <StableHorseCard />
        </div>
      </div>
    </>
  );
}
export default StableHorsePage;
