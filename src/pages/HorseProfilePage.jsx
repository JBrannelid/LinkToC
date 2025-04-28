import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import ProfilePage from "../components/ui/userPage/HorseProfilePage.jsx";
import { useAppContext } from "../context/AppContext.jsx";

const ProfileTester = () => {
  // We need to change hardcoded image placeholder
  const placeholderImage = "/src/assets/images/profilePlaceholder.jpg";

  const { horseId } = useParams();
  const navigate = useNavigate();
  const { selectedHorse } = useAppContext();

  // Use a valid horse ID from the URL or context, or redirect
  useEffect(() => {
    if (selectedHorse?.id) {
      navigate(`/horsepage/${selectedHorse.id}`, { replace: true });
    }
  }, [selectedHorse?.id, navigate]);

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
