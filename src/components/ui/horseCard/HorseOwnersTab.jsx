import React from "react";
import { useNavigate } from "react-router";
import { buildRoute, ROUTES } from "../../../routes/index.jsx";
import { getHorseUserRoleName } from "../../../utils/horseProfileUtils";
import ProfileImage from "../../common/ProfileImage";
import LoadingSpinner from "../LoadingSpinner";

const HorseOwnersTab = ({ horseProfile }) => {
  const navigate = useNavigate();

  // Extract owners from horseProfile data
  const horseOwners = horseProfile?.userHorseRoles || [];
  const loading = !horseProfile;

  const handleUserClick = (userId) => {
    if (userId) {
      navigate(buildRoute(ROUTES.USER_PROFILE, { userId }));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <span className="ml-2">Loading horse's owners...</span>
      </div>
    );
  }

  // No owners available
  if (!horseOwners || horseOwners.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-center text-gray py-4">
          No owners registered for this horse
        </p>
      </div>
    );
  }

  // Display horse's owners from the profile data
  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-10 sm:grid-cols-2 sm:gap-15 lg:grid-cols-3 lg:gap-6">
        {horseOwners.map((ownerRole, index) => {
          if (!ownerRole) return null;

          // Create a userData variable to avoid undefined references
          const userData = ownerRole.user || {};
          const userName =
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
            "Unnamed User";

          const roleName = getHorseUserRoleName(ownerRole.userRole);

          return (
            <div
              key={`user-${userData.id || index}`}
              className="border border-primary rounded-lg overflow-hidden cursor-pointer mx-auto max-w-xs bg-gradient-to-b from-primary-light to-white"
              onClick={() => handleUserClick(userData.id)}
            >
              <div className="flex justify-center items-center overflow-hidden ">
                <ProfileImage
                  user={userData}
                  className="scale-70 w-35 h-35 sm:w-45 sm:h-45 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover border-2 border-primary rounded-full bg-background"
                  size="rounded"
                  alt={`User ${userName}`}
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-bold">{userName}</h3>
                <p className=" text-sm">
                  Role: {roleName || "Connected"}
                  <br />
                  {userData.phoneNumber && `Phone: ${userData.phoneNumber}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HorseOwnersTab;
