const deg2rad = (deg) => {
    return deg * (Math.PI/180);
};
export const calculateDistanceUtil = (lat1, lon1, lat2, lon2) => {
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
export const formatDistanceUtil = (distance) => {
    if (distance === null || distance === undefined) return '';
    return `${distance.toFixed(1)} km`;
};
export const getDirectionsUrlUtil = (latitude, longitude) => {
    if (!latitude || !longitude) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
};