import React from "react";
import HorseOwnersTab from "./HorseOwnersTab";

const HorseProfileContent = ({ horse, horseProfile, activeTab }) => {
  // Render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoTabContent horse={horse} horseProfile={horseProfile} />;
      case "owners":
        return (
          <HorseOwnersTab horseId={horse.id} horseProfile={horseProfile} />
        );
      default:
        return <InfoTabContent horse={horse} horseProfile={horseProfile} />;
    }
  };

  return (
    <>
      {/* Desktop content */}
      <div className="hidden lg:block lg:px-40 xl:px-60 py-4">
        {renderTabContent()}
      </div>

      {/* Mobile  */}
      <div className="py-2 lg:hidden">{renderTabContent()}</div>
    </>
  );
};

// Info tab content
const InfoTabContent = ({ horse, horseProfile }) => {
  const enhancedHorse = horseProfile?.horse || horse;

  // Get horse data
  const breed = enhancedHorse?.breed || "Unknown breed";
  const color = enhancedHorse?.color || "Unknown color";
  const age = enhancedHorse?.age
    ? new Date(enhancedHorse.age).getFullYear()
    : "Unknown";
  const currentYear = new Date().getFullYear();
  const ageInYears = age !== "Unknown" ? currentYear - age : "Unknown";

  // Additional fields we might want to display
  const bio = enhancedHorse?.bio || "No bio available";
  const discipline = enhancedHorse?.discipline || "No discipline specified";

  return (
    <div className="space-y-4 px-10">
      {/* Details section */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold mr-2">Details: </h3>
        <div className="bg-white p-4 rounded-lg shadow-lg w-full">
          <p>lorem</p>
        </div>
      </div>

      {/* Bio section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">About {enhancedHorse.name}</h3>
        <p className="whitespace-pre-line">{bio}</p>

        {discipline !== "No discipline specified" && (
          <div className="mt-4">
            <p>lorem</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorseProfileContent;
