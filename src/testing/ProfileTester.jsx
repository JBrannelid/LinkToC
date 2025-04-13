import React, { useState, useEffect } from 'react';
import { ProfilePage } from "../components/ui/userPage/HorseProfilePage.jsx";
import createBaseService from "../api/services/baseService.js";
import { createError, ErrorTypes } from "../api/index.js";
import {createHorseProfile} from "../utils/horseProfileUtils.js";


// Define the endpoint and create the service
const endpoint = '/api/horse';
const horseService = createBaseService(endpoint);

// Updated to use horseProfileUtils for consistency

const processHorseData = (horse) => {
    // Convert age from ISO string to age in years
    if (horse.age && typeof horse.age === 'string') {
        try {
            const birthDate = new Date(horse.age);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();

            // Adjust age if birthday hasn't occurred yet this year
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            horse.ageYears = age;
        } catch (e) {
            console.error("Error calculating age:", e);
            horse.ageYears = "Unknown";
        }
    }
    // Use createHorseProfile to ensure complete data structure
    return createHorseProfile(horse);
};
const fetchHorseData = async (horseId) => {
    try {
        if (!horseId) {
            console.error("Horse ID is missing:", horseId);
            throw createError("Horse ID is required", ErrorTypes.VALIDATION, 400);
        }

        console.log(`Calling horseService.getById(${horseId})...`);
        const response = await horseService.getById(horseId);
        console.log("Raw API Response:", response);

        if (!response) {
            console.error(`No response received from API for horse ID ${horseId}`);
            return null;
        }

        if (!response.data) {
            if (response.isSuccess && response.value) {
                console.log("Attempting to use response directly as it has expected structure");
                const horse = response.value;
                return processHorseData(horse);
            }
            return null;
        }

        if (!response.data.isSuccess) {
            console.error(`Error from API: ${response.data.message}`);
            return null;
        }

        const horse = response.data.value;

        if (!horse) {
            console.error(`Horse with ID ${horseId} not found.`);
            return null;
        }

        return processHorseData(horse);
    } catch (error) {
        console.error(`Error fetching horse data with ID ${horseId}:`, error);
        return null;
    }
};

const ProfileTester = ({ horseId }) => {
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const placeholderImage = "/src/assets/images/profilePlaceholder.jpg";

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await fetchHorseData(horseId);
                setHorse(data);
            } catch (error) {
                setError(error.message || "Failed to load horse data");
                console.error("Error loading horse data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [horseId]);

    // This function handles the onDetailsClick event and matches the signature expected by ProfilePage
    const handleDetailsClick = async (id) => {
        // Since we already have the horse data, we can return it immediately
        // If needed, you could re-fetch the data here
        return horse;
    };

    // Check if we're still loading or have an error
    if (loading) {
        return <div>Loading horse profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // If we have no horse data, show an error
    if (!horse) {
        return <div>No horse data found</div>;
    }
    
    
    // Render the ProfilePage component with the horse data
    return (
        <div className="container mx-auto px-4 py-8">
            <ProfilePage
                horseId={horseId}
                imageUrl={horse.imageUrl}
                onDetailsClick={handleDetailsClick}
                loadingText="Loading horse profile..."
                notFoundText="Horse profile not found"
                placeholderImageUrl={placeholderImage}
               />
        </div>
    );
};

export default ProfileTester;