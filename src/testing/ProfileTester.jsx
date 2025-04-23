import React from 'react';
import { ProfilePage } from "../components/ui/userPage/HorseProfilePage.jsx";

const ProfileTester = ({ horseId }) => {
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