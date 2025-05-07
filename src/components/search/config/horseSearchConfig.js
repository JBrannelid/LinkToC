import { createSearchConfig } from './searchConfigBase';
import {horseService} from "../../../api/index.js";

const stableId = currentStable?.id;
const horseSearchConfig = createSearchConfig({
    entityType: 'horse',

    searchFn: async (query) => {
        try {
            // Match API parameters expected by the backend
            // Adjust these parameters to match what your user search API expects
            const params = {
                searchTerm: query,
                stableId: stableId,
                page: 0,
                pageSize: 10
            };

            
            const response = await horseService.search(params);
            
            if (!response || !response.isSuccess) {
                throw new Error(response?.message || 'Search failed');
            }

            
            return {
                success: response.isSuccess,
                data: response.data || [],
                message: response.message || 'Search completed'
            };
        } catch (error) {
            console.error('Horse search error:', error);
            throw error;
        }
    },
    
    idField: 'id',
    labelField: 'name',
    secondaryField: 'breed',
    imageField: 'profileImage',
    
    placeholderTextField: 'Search for horses...',
    actionButtonText: 'Search',
    cancelButtonText: 'Cancel',
    noResultsText: "Can't find any horse with that name. Try another search.",
    errorText: 'An error occurred while searching. Try again later.',
    loadingText: 'Searching for horses...',
    
    selectionMode: 'single',
});

export default horseSearchConfig;