import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ui/Card/profileCard.jsx";
import HorseData from "./HorseData.json";

const fetchHorseData = async (horseId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const horse = HorseData.find(h => h.id === Number(horseId));
            resolve(horse || null); // Return null if no matching horse is found
        }, 1000);
    });
};

const HorseProfile2 = ({ horseId }) => {
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getHorseData = async () => {
        try {
            setLoading(true);
            const data = await fetchHorseData(1); // For testing purposes
            setHorse(data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch horse');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void getHorseData();
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
                    onClick={getHorseData}
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
            onDetailsClick={getHorseData}
            containerClassName={
                horse.breed === "Arabian" ? "border border-red-200" : ""
            }
            loadingText="Loading horse profile..."
            notFoundText="No horse data found"
            placeholderImageUrl="/path/to/horse-silhouette.jpg"
        />
    );
};

export default HorseProfile2;