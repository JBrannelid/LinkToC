import React from "react";
import ModalHeader from "../components/layout/ModalHeader";
import { getProfileImageUrl, formatUserFullName } from "../utils/userUtils";
import { useAuth } from "../context/AuthContext";
import PinIcon from "../assets/icons/PinIcon";
import { useUserData } from "../hooks/useUserData";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function StablePostPage() {
  const { user, isLoading } = useAuth();

  // Fetch user data with error and load handling
  const { userData, loadingState } = useUserData();

  // Display loading spinner
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="medium" className="text-gray" />
        <p className="ml-2">{loadingState.getMessage()}</p>
      </div>
    );
  }

  // Get data from database (userData) or JWT (user)
  const displayUser = userData || user;
  const userFullName = formatUserFullName(displayUser);
  const profileImageUrl = getProfileImageUrl(displayUser?.profileImage);

  return (
    <div className="bg-background flex flex-col overflow-y-hidden pb-30">
      <div>
        <ModalHeader title="Flödet" />
      </div>
      <div className="flex-1 px-6 py-2">
        {/* Today section */}
        <h2 className="text-2xl pb-2">Idag</h2>
        <div className="bg-white w-full rounded-lg px-3 py-4">
          <div className="flex justify-between pb-4">
            <div className="w-10 h-10 border-1 border-primary rounded-full overflow-hidden mr-4">
              <img
                src={profileImageUrl}
                alt={`Profile image of `}
                className="w-full h-full object-cover"
              />
            </div>
            <PinIcon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="pb-4">Foderbeställning</h3>
          <p>
            På fredag lägger jag nästa foderbeställning. Skriv till mig eller
            lämna en kommentar om ni önskar att jag beställer något
          </p>
          <p className="text-sm text-grey opacity-80 pt-5">{userFullName}</p>
        </div>
        {/* Older post section */}
        <h2 className="text-2xl pb-2 pt-4">Igår</h2>
        <div className="bg-white w-full rounded-lg px-3 py-4">
          <h3 className="pb-4">Härlig tur igår eftermiddag</h3>
          <p>Hoppas alla får en fin helg!</p>
          <p className="text-sm text-grey opacity-80 pt-5">Anna Larsson</p>
        </div>
      </div>
    </div>
  );
}
