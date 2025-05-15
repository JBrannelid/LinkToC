// hooks/useStableLocationData.js
import { useState } from "react";
import { createErrorMessage, createSuccessMessage } from "../utils/errorUtils";
import axiosInstance from "../api/config/axiosConfig.js";

export const useStableLocation = () => {
    const [locationData, setLocationData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchLocationData = async (postcode) => {
        if (!postcode || postcode.trim() === "") return;

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await axiosInstance.get(`/api/stable-location/${postcode}`);
            
            if (result.isSuccess === true) {
                setLocationData(result.value);
                setIsLoading(false);
                return;
            }

            setMessage(createErrorMessage(result.message || "Could not find location data for this postcode"));
            setLocationData(null);
        } catch (err) {
            setMessage(createErrorMessage("Failed to fetch location data. Please check your connection."));
            setLocationData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return { locationData, isLoading, message, fetchLocationData };
};

export default useStableLocation;