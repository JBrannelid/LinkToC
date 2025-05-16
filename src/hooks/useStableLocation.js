
import { useState, useEffect, useCallback } from "react";
import { createErrorMessage, createSuccessMessage } from "../utils/errorUtils";
import axiosInstance from "../api/config/axiosConfig.js";

const deg2rad = (deg) => {
    return deg * (Math.PI/180);
};
const calculateDistanceUtil = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
};
const formatDistanceUtil = (distance) => {
    if (distance === null || distance === undefined) return '';
    return `${distance.toFixed(1)} km`;
};
const getDirectionsUrlUtil = (latitude, longitude) => {
    if (!latitude || !longitude) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
};

export const useStableLocation = (options = {}) => {
    const [locationData, setLocationData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // New state for user location
    const [userLocation, setUserLocation] = useState(null);
    const [userLocationStatus, setUserLocationStatus] = useState(null);
    const defaultOptions = {
        autoGetUserLocation: false
    };
    const mergedOptions = {
        ...defaultOptions,
        ...options
    };
    // Define getUserLocation first since it doesn't depend on other functions
    const getUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setUserLocationStatus('not-supported');
            return;
        }

        setUserLocationStatus('requesting');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                setUserLocationStatus('success');
            },
            (error) => {
                console.error('Error getting location:', error);
                setUserLocationStatus('error');
            }
        );
    }, []);

    // Auto-request user location on mount if option is set
    useEffect(() => {
        if (mergedOptions.autoGetUserLocation) {
            getUserLocation();
        }
    }, [mergedOptions.autoGetUserLocation, getUserLocation]);

    // Wrap utility functions in useCallback to maintain stable references
    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        return calculateDistanceUtil(lat1, lon1, lat2, lon2);
    }, []);

    // Calculate distance between user location and a specific location
    const getDistanceToLocation = useCallback((location) => {
        if (!userLocation || !location || !location.latitude || !location.longitude) {
            return null;
        }

        return calculateDistanceUtil(
            userLocation.latitude,
            userLocation.longitude,
            location.latitude,
            location.longitude
        );
    }, [userLocation]);

    // Generate Google Maps directions URL
    const getDirectionsUrl = useCallback((latitude, longitude) => {
        return getDirectionsUrlUtil(latitude, longitude);
    }, []);

    // Format distance for display
    const formatDistance = useCallback((distance) => {
        return formatDistanceUtil(distance);
    }, []);

    // Original fetchLocationData function (keeping it compatible)
    const fetchLocationData = useCallback(async (postcode) => {
        if (!postcode || postcode.trim() === "") return;

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await axiosInstance.get(`/api/stable-location/${postcode}`);

            if (result.isSuccess === true) {
                // Add distance if we have user location
                let locationWithDistance = result.value;

                if (userLocation && result.value.latitude && result.value.longitude) {
                    const distance = calculateDistanceUtil(
                        userLocation.latitude,
                        userLocation.longitude,
                        result.value.latitude,
                        result.value.longitude
                    );
                    locationWithDistance = {
                        ...result.value,
                        distance
                    };
                }

                setLocationData(locationWithDistance);
                setIsLoading(false);
                return locationWithDistance;
            }

            setMessage(createErrorMessage(result.message || "Could not find location data for this postcode"));
            setLocationData(null);
            return null;
        } catch (err) {
            setMessage(createErrorMessage("Failed to fetch location data. Please check your connection."));
            setLocationData(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [userLocation]);

    return {
        // Original values
        locationData,
        isLoading,
        message,
        fetchLocationData,

        // New values
        userLocation,
        userLocationStatus,
        getUserLocation,
        getDistanceToLocation,
        calculateDistance,
        getDirectionsUrl,
        formatDistance
    };
};

export default useStableLocation;