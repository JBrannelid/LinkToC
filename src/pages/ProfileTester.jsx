import React from "react";
import { useParams } from "react-router";
import { ProfilePage } from "../components/ui/userPage/HorseProfilePage.jsx";

const ProfileTester = () => {
  // Get the horseId from URL parameters
  const { horseId } = useParams();
  const placeholderImage = "/src/assets/images/profilePlaceholder.jpg";

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfilePage
        horseId={horseId}
        loadingText="Loading horse profile..."
        notFoundText="Horse profile not found"
        placeholderImageUrl={placeholderImage}
      />
    </div>
  );
};

export default ProfileTester;
