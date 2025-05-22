import useStableLocation from "./useStableLocation.js";
import { useMemo, useCallback } from "react";
import { createStableSearchConfig } from "../components/search/config/entityBuilder.js";
import axiosInstance from "../api/config/axiosConfig.js";
import { ListItemRenderer } from "../components/search/SearchResultRenderers.jsx";

export const useStableSearchWithDistance = (options = {}) => {
  const stableLocationHook = useStableLocation({ autoGetUserLocation: true });
  const { userLocation, calculateDistance } = stableLocationHook;

  // Create function to add distance to a stable
  const addDistanceToStable = useCallback(
    async (stable, userLocation) => {
      // If stable already has coordinates, use them directly
      if (stable.latitude && stable.longitude) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          stable.latitude,
          stable.longitude
        );
        return { ...stable, distance };
      }

      // If stable has postcode, use it to fetch location
      if (stable.postCode) {
        try {
          const locationResponse = await axiosInstance.get(
            `/api/stable-location/${stable.postCode}`
          );

          if (locationResponse.isSuccess && locationResponse.value) {
            const locationData = locationResponse.value;

            if (locationData.latitude && locationData.longitude) {
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                locationData.latitude,
                locationData.longitude
              );

              return {
                ...stable,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                distance,
              };
            }
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      }
      // If stable doesn't have postcode, get the full stable details
      else {
        try {
          // Use the correct endpoint path from your backend
          const response = await axiosInstance.get(`/api/stable/${stable.id}`);

          if (response.isSuccess && response.value?.postCode) {
            const fullStable = response.value;

            // Now get the location data
            const locationResponse = await axiosInstance.get(
              `/api/stable-location/${fullStable.postCode}`
            );

            if (locationResponse.isSuccess && locationResponse.value) {
              const locationData = locationResponse.value;

              if (locationData.latitude && locationData.longitude) {
                const distance = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  locationData.latitude,
                  locationData.longitude
                );

                return {
                  ...stable,
                  postCode: fullStable.postCode,
                  latitude: locationData.latitude,
                  longitude: locationData.longitude,
                  distance,
                };
              }
            }
          } else {
            console.warn(
              "Stable details missing postcode or request failed:",
              response
            );
          }
        } catch (error) {
          console.error("Error fetching stable details or location:", error);
        }
      }

      // Return original stable if we couldn't add distance
      return stable;
    },
    [calculateDistance]
  );

  // Create enhanced configuration
  const searchConfig = useMemo(() => {
    // Start with the standard stable config
    const baseConfig = createStableSearchConfig();

    // Add custom search function that enhances results with distance
    const enhancedConfig = {
      ...baseConfig,
      // Override the search function to add distance data
      searchFn: async (query) => {
        const results = await baseConfig.searchFn(query);

        // Add distance to results if we have user location
        if (results.success && userLocation) {
          // Process each stable with Promise.all for parallel processing
          const enhancedStables = await Promise.all(
            results.data.map((stable) =>
              addDistanceToStable(stable, userLocation)
            )
          );
          results.data = enhancedStables;
        }
        return results;
      },
      // Use custom renderer that shows distance
      resultItemRenderer: ListItemRenderer,
    };

    return enhancedConfig;
  }, [userLocation, addDistanceToStable]);

  return { searchConfig, ...stableLocationHook };
};
