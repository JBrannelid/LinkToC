import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import HorseProfileContent from "../components/ui/horseCard/HorseProfileContent";
import HorseProfileHeader from "../components/ui/horseCard/HorseProfileHeader";
import HorseProfileTabs from "../components/ui/horseCard/HorseProfileTabs";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useHorseProfile } from "../hooks/useHorseProfile";

const HorseProfilePage = () => {
  const { horseId } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const [refreshCounter, setRefreshCounter] = useState(0); // Forced refreshes after an API call

  const {
    horse,
    horseProfile,
    loading,
    error,
    loadingState,
    fetchHorseProfile,
  } = useHorseProfile(horseId);

  // Refreshes API data and updates local state
  const forceRefresh = useCallback(async () => {
    if (horseId) {
      try {
        await fetchHorseProfile(horseId);
        // Force component re-render by incrementing counter
        setRefreshCounter((prev) => prev + 1);
      } catch (error) {
        console.error("Error refreshing horse profile:", error);
      }
    }
  }, [horseId, fetchHorseProfile]);

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
          Whoa there! This horse has left the stable 🐎
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 lg:p-0 overflow-y-auto">
      <HorseProfileHeader
        key={`header-${refreshCounter}`}
        horse={horse}
        horseProfile={horseProfile}
        forceRefresh={forceRefresh}
      />
      <HorseProfileTabs activeTab={activeTab} onChange={setActiveTab} />
      <HorseProfileContent
        key={`content-${refreshCounter}`} // Force re-mount when data changes
        horse={horse}
        horseProfile={horseProfile}
        activeTab={activeTab}
        forceRefresh={forceRefresh}
      />
    </div>
  );
};

export default HorseProfilePage;
