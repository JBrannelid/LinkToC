import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import HorseData from "./HorseData.json";

const fetchHorseData = async (horseId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const horse = HorseData.find(h => h.id === Number(horseId)); // Ensure you are passing the correct ID type
            console.log("Getting data3");
            resolve(horse || null); // Return null if no matching horse is found
        }, 1000);
    });
};

const HorseProfile = ({ horseId }) => {
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getHorseData = async () => {
        try {
            setLoading(true);
            const data = await fetchHorseData(2);
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
        getHorseData();
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

    const titleId = `horse-${horse.id}-title`;
    const descId = `horse-${horse.id}-desc`;

    return (
        <Card.Container
            id={`horse-${horse.id}-profile`}
            aria-label={titleId}
            aria-describedby={descId}>
            <Card.Image
                src={horse.imageUrl}
                alt={`${horse.color} ${horse.breed} horse named ${horse.name}`}
            />
            <Card.Header>
                <Card.Title id={titleId}>{horse.name}</Card.Title>
                <Card.Subtitle>{`${horse.breed} • ${horse.age} years • ${horse.color}`}</Card.Subtitle>
            </Card.Header>
            <Card.Body id={descId}>
                <p>{horse.description}</p>

                {horse.stats && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <h4 className="font-semibold mb-2">Statistics</h4>
                        <ul className="grid grid-cols-3 gap-2">
                            {horse.stats.weight && (
                                <li>
                                    <span className="block text-sm text-gray-500">Weight</span>
                                    <span>{horse.stats.weight} kg</span>
                                </li>
                            )}
                            {horse.stats.height && (
                                <li>
                                    <span className="block text-sm text-gray-500">Height</span>
                                    <span>{horse.stats.height} cm</span>
                                </li>
                            )}
                            {horse.stats.victories && (
                                <li>
                                    <span className="block text-sm text-gray-500">Victories</span>
                                    <span>{horse.stats.victories}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </Card.Body>
            <Card.Footer>
                <button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`View full details for ${horse.name}`}>
                    View Full Details
                </button>
            </Card.Footer>
        </Card.Container>
    );
};

export default HorseProfile;
