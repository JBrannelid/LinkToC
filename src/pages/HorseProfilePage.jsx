import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHorseProfile } from "../hooks/useHorseProfile";
import HorseProfileHeader from "../components/ui/horseCard/HorseProfileHeader";
import HorseProfileTabs from "../components/ui/horseCard/HorseProfileTabs";
import HorseProfileContent from "../components/ui/horseCard/HorseProfileContent";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const HorseProfilePage = () => {
  const { horseId } = useParams();
  const [activeTab, setActiveTab] = useState("info");

  const {
    horse,
    horseProfile,
    loading,
    error,
    loadingState,
    fetchHorseProfile,
  } = useHorseProfile(horseId);

  useEffect(() => {
    if (horseId) {
      fetchHorseProfile(horseId);
    }
  }, [horseId, fetchHorseProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <span className="ml-2">{loadingState.getMessage()}</span>
      </div>
    );
  }

  if (error || !horse) {
    return (
      <div className="bg-white rounded-lg p-6 m-4 text-center">
        <h2 className="text-xl font-medium mb-2">Horse not found</h2>
        <p className="text-gray-600 mb-4">
          The horse profile you are looking for could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 lg:p-0 overflow-y-auto">
      <HorseProfileHeader horse={horse} horseProfile={horseProfile} />
      <HorseProfileTabs activeTab={activeTab} onChange={setActiveTab} />
      <HorseProfileContent
        horse={horse}
        horseProfile={horseProfile}
        activeTab={activeTab}
      />
    </div>
  );
};

export default HorseProfilePage;
