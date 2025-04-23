import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ui/Card/profileCard.jsx";
import createBaseService from "../api/services/baseService.js";
import { createError, ErrorTypes } from "../api/index.js";

// Define the endpoint and create the service
const endpoint = '/api/horse';
const horseService = createBaseService(endpoint);

const fetchHorseData = async (horseId) => {
    try {
        if (!horseId) {
            console.error("Horse ID is missing:", horseId);
            throw createError("Horse ID is required", ErrorTypes.VALIDATION, 400);
        }

        console.log(`Calling horseService.getById(${horseId})...`);
        // Fetch the data using the service's getById method
        const response = await horseService.getById(horseId);

        // Log the entire response to see what we're getting
        console.log("Raw API Response:", response);

        if (!response) {
            console.error(`No response received from API for horse ID ${horseId}`);
            return null;
        }

        if (!response.data) {
            console.error(`Response has no data property for horse ID ${horseId}`, response);
            // Try to extract data from response directly if it has the expected structure
            if (response.isSuccess && response.value) {
                console.log("Attempting to use response directly as it has expected structure");
                const horse = response.value;
                return processHorseData(horse);
            }
            return null;
        }

        // The horse data is in the 'value' property of the response
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

// Helper function to process horse data
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
    return horse;
};

const HorseProfile = ({ horseId }) => {
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getData = async () => {
        try {
            console.log("Fetching data for horseId:", horseId); // Debug log
            if (!horseId) {
                console.error("horseId is undefined or null");
                setError("Horse ID is required");
                return;
            }

            setLoading(true);
            const data = await fetchHorseData(horseId);
            console.log("Processed horse data:", data);
            setHorse(data);
            setError(null);
        } catch (error) {
            setError(`Failed to fetch data: ${error.message || "Unknown error"}`);
            console.error("Error in getData:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void getData();
    }, [horseId]);

    if (loading) {
        return (
            <div className="p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
                <p className="text-center">Loading horse profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                <p className="text-red-700 text-center">{error}</p>
                <button
                    onClick={getData}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg mx-auto block">
                    Retry
                </button>
            </div>
        );
    }

    if (!horse) {
        return (
            <div className="p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
                <p className="text-center">No horse data found</p>
                <button
                    onClick={getData}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg mx-auto block">
                    Retry
                </button>
            </div>
        );
    }

    // Format horse data for the reusable ProfileCard
    const metadata = [
        horse.breed,
        `${horse.ageYears || 'Unknown'} years`,
        horse.color
    ];

    const stats = [];

    if (horse.stats) {
        if (horse.stats.weight) {
            stats.push({
                label: 'Weight',
                value: `${horse.stats.weight} kg`

            });

        }
        if (horse.stats.height) {
            stats.push({
                label: 'Height',
                value: `${horse.stats.height} cm`
            });
        }
        if (horse.stats.victories) {
            stats.push({
                label: 'Victories',
                value: horse.stats.victories,
                className: horse.stats.victories > 5 ? 'font-semibold text-green-700' : ''
            });
        }
    }

    return (
        <ProfileCard
            id={horse.id}
            name={horse.name}
            imageUrl={horse.imageUrl || 'src/assets/images/profilePlaceholder.jpg'}
            description={horse.description || `A ${horse.color} ${horse.breed} horse.`}
            metadata={metadata}
            stats={stats}
            onDetailsClick={getData}
            loadingText="Loading horse profile..."
            notFoundText="No horse data found"
            placeholderImageUrl="src/assets/images/profilePlaceholder.jpg"
        />
    );
};

export default HorseProfile;