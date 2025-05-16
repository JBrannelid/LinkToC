import React from 'react';
import useStableLocation from "../../hooks/useStableLocation.js";
import LocationPinIcon from "../../assets/icons/LocationPinIcon.jsx";


const DisplayDistance = ({
                             directionsUrl,
                             distance,
                             locationName,
                             className = '',
                             iconSize = 14,
                             showLabel = true
                         }) => {
    // Format distance
    const formattedDistance = distance !== undefined
        ? `${distance.toFixed(1)} km ${showLabel ? 'from you' : ''}`
        : '';

    return (
        <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-semibold text-primary truncate flex items-center gap-1 hover:underline ${className}`}
            aria-label={`Get directions to ${locationName || 'location'}${distance ? `, ${distance.toFixed(1)} km away` : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            <LocationPinIcon size={iconSize} />
            {formattedDistance}
        </a>
    );
};

const ConnectedDisplayDistance = ({
                                      stableId,
                                      latitude,
                                      longitude,
                                      locationName,
                                      distance: propDistance,
                                      ...otherProps
                                  }) => {
    const {
        userLocation,
        calculateDistance,
        getDirectionsUrl
    } = useStableLocation();

    // If no coordinates, don't render
    if (!latitude || !longitude) return null;

    // Calculate distance if needed
    const distance = propDistance !== undefined
        ? propDistance
        : (userLocation
            ? calculateDistance(userLocation.latitude, userLocation.longitude, latitude, longitude)
            : undefined);

    // Generate directions URL
    const directionsUrl = getDirectionsUrl
        ? getDirectionsUrl(latitude, longitude)
        : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

    return (
        <DisplayDistance
            directionsUrl={directionsUrl}
            distance={distance}
            locationName={locationName}
            {...otherProps}
        />
    );
};

export { DisplayDistance, ConnectedDisplayDistance };
export default ConnectedDisplayDistance;