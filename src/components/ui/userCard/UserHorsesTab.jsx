import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router";
import { buildRoute, ROUTES } from "../../../routes/index.jsx";
import LoadingSpinner from "../LoadingSpinner";

const UserHorsesTab = ({ userProfile }) => {
  const navigate = useNavigate();
  const getHorseImageUrl = (horse) => {
    return horse?.imageUrl || "/images/horeImagePlaceholder.webp";
  };

  // Extract horses from userProfile data
  const userHorses = userProfile?.userHorseRoles || [];
  const loading = !userProfile; // Assuming userProfile is fetched from an API

  const handleHorseClick = (horseId) => {
    navigate(buildRoute(ROUTES.HORSE_PROFILE, { horseId }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <span className="ml-2">Loading user's horses...</span>
      </div>
    );
  }

  // No horses available
  if (userHorses.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-center text-gray py-4">
          No horses available for this user
        </p>
      </div>
    );
  }

  // Display user's horses from the profile data
  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-4 px-10 sm:grid-cols-2 sm:gap-15 lg:grid-cols-3 lg:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {" "}
        {userHorses.map((horseRole) => {
          const horse = horseRole.horse;

          // Extract horse data with fallback values
          const horseName = horse?.name || "Unnamed Horse";
          const horseColor = horse?.color || "Unknown";
          const userRole = horseRole.userRole;

          return (
            <motion.div
              key={`horse-${horse.id}`}
              className="border border-primary rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleHorseClick(horse.id)}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                y: -4,
                scale: 1.02,
                boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full h-50">
                <img
                  src={getHorseImageUrl(horse)}
                  alt={`Horse ${horseName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold">{horseName}</h3>
                <p className="text-gray text-sm">
                  Color: {horseColor}
                  <br />
                  Role:{" "}
                  {userRole === 0
                    ? "Owner"
                    : userRole === 1
                    ? "Rider"
                    : "Caretaker"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default UserHorsesTab;
