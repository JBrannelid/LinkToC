import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ui/Card/profileCard.jsx";
import createBaseService from "../api/services/baseService.js";
import {createError, ErrorTypes} from "../api/index.js";




const endpoint = '/api/horse';

// Create a base service or use an existing one
const horseService = createBaseService(endpoint);

const fetchHorseData = async (horseId) => {
    try {
        if (!horseId) {
            console.error("Horse ID is missing:", horseId);
            throw createError("Horse ID is required", ErrorTypes.VALIDATION, 400);
        }

        // Fetch the data using the service's getById method
        const response = await horseService.getById(horseId);

        // The response should directly contain the horse data
        const horse = response.data;

        if (!horse) {
            console.error(`Horse with ID ${horseId} not found.`);
            return null;
        }

        return horse;
    } catch (error) {
        console.error(`Error fetching horse data with ID ${horseId}:`, error);
        return null;
    }
};

const HorseProfile2 = ({horseId}) => {
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
            const data = await fetchHorseData(horseId); // For testing purposes
            setHorse(data);
            setError(null);
        } catch (error) {
            setError(`Failed to fetch data`);
            console.log(error);
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
            </div>
        );
    }

    // Format horse data for the reusable ProfileCard
    const metadata = [
        horse.breed,
        `${horse.age} years`,
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
            imageUrl={horse.imageUrl}
            description={horse.description}
            metadata={metadata}
            stats={stats}
            onDetailsClick={getData}
            loadingText="Loading horse profile..."
            notFoundText="No horse data found"
            placeholderImageUrl="src/assets/images/profilePlaceholder.jpg"
        />
    );
};

export default HorseProfile2;