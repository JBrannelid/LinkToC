import React, { useEffect, useState } from "react";
import Card from "../utils/cardUtils.js";
import HorseData from "./HorseData.json";

const fetchHorseData = async (horseId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const horse = HorseData.find(h => h.id === Number(horseId));
            resolve(horse || null); // Return null if no matching horse is found
        }, 1000);
    });
};

const horseProfile = ({ horseId }) => {
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profileImage, setProfileImage] = useState(horse?.imageUrl || "src/components/ui/Images/profilePlaceholder.jpg");
    const [fileInputRef, setFileInputRef] = useState(null);
    
    const triggerFileUpload = () => {
        if (fileInputRef) {
            fileInputRef.click();
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    }
    const getHorseData = async () => {
        try {
            setLoading(true);
            const data = await fetchHorseData(1);
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

    const titleId = `horse-${horse.id}-title`;
    const descId = `horse-${horse.id}-desc`;

    return (
        <Card.Container 
            id={`horse-${horse.id}-profile`}
            aria-labelledby={titleId}
            aria-describedby={descId}>
            <Card.Image
                src={profileImage}
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
                <div className="flex space-x-2">
                    <button tabIndex={0} onClick={getHorseData}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={`View full details for ${horse.name}`}>
                        View Full Details
                    </button>  
                    <input
                    type="file"
                    ref={ref => setFileInputRef(ref)}
                    id="profile-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    />
                    <button 
                        onClick={triggerFileUpload}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        aria-label="Upload profile picture for horse">
                        Update Photo
                    </button>
                </div>
            </Card.Footer>
        </Card.Container>
    );
};

export default horseProfile;
