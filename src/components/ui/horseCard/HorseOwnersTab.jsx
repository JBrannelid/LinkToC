import React from "react";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { useNavigate } from "react-router";
import { buildRoute, ROUTES } from "../../../routes/index.jsx";
import { getHorseUserRoleName } from "../../../utils/horseProfileUtils";
import { getProfileImageUrl } from "../../../utils/userUtils";

const HorseOwnersTab = ({ horseId, horseProfile }) => {
  const navigate = useNavigate();

  // Extract owners from horseProfile data
  const horseOwners = horseProfile?.userHorseRoles || [];
  const loading = !horseProfile; // Assuming horseProfile is fetched from an API
  const profilePictureUrl = getProfileImageUrl(user.profilePictureUrl);

  const handleUserClick = (userId) => {
    navigate(buildRoute(ROUTES.USER_PROFILE, { userId }));
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
  if (horseOwners.length === 0) {
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
        {horseOwners.map((ownerRole) => {
          const user = ownerRole.user;

          if (!user) return null;

          // Extract user data with fallback values
          const userName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "Unnamed User";

          const roleName = getHorseUserRoleName(ownerRole.userRole);

          return (
            <div
              key={`user-${user.id}`}
              className="border border-primary rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleUserClick(user.id)}
            >
              <div className="w-full h-50">
                <img
                  src={profilePictureUrl}
                  alt={`User ${userName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold">{userName}</h3>
                <p className="text-gray text-sm">
                  Role: {roleName || "Connected"}
                  <br />
                  {user.phoneNumber && `Phone: ${user.phoneNumber}`}
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
