import { createSearchConfig} from "./searchConfigBase.js";
import {stableService} from "../../../api/index.js";
import {createErrorMessage, getErrorMessage} from "../../../utils/errorUtils.js";

// const stableId = currentStable?.id;
const stableSearchConfig = createSearchConfig({
    entityType: 'stable',

    searchFn: async (query) => {
        try {
            const params = {
                searchTerm: query,
                // stableId: stableId,
                page: 0,
                pageSize: 10,
            };
            

            const response = await stableService.search(params);
            
            if(!response) {
                throw new Error('No response from server. Please try again.');
            }

            if (response.success !== undefined) {
                if (!response.success) {
                    throw new Error(response.message || 'Search failed');
                }

                return {
                    success: true,
                    data: response.data || [],
                    message: response.message || 'Search completed'
                };
            }

            if (response.isSuccess !== undefined) {
                if (!response.isSuccess) {
                    throw new Error(response.message || 'Search failed');
                }

                if (response.value && response.value.length > 0) {
                    console.log('First stable item:', response.value[0]);
                }

                return {
                    success: true,
                    data: response.value || [],
                    message: response.message || 'Search completed'
                };
            }

            if (Array.isArray(response)) {
                return {
                    success: true,
                    data: response,
                    message: 'Search completed'
                };
            }

            console.warn("Unexpected response format:", response);
            return {
                success: true,
                data: [],
                message: 'No results found'
            };

        } catch (error) {
            console.error('Stable search error:', error);
            
            return {
                success: false,
                data: [],
                message: error.message || 'Search failed',
                error: error
            };
        }
    },
    idField: 'id',
    labelField: 'name',
    secondaryField: 'county',
    tertiaryField: 'address',
    typeField: 'type',

    // UI text customized for stable search
    placeholderText: 'Search for stable name...',
    actionButtonText: 'Join',
    cancelButtonText: 'Return',
    noResultsText: "Can't find a stable with that name. Try another name.",
    errorText: 'An error occurred while searching. Try again later.',
    loadingText: 'Searching for stables...',

    // Single selection for stables
    selectionMode: 'single'

});

export default stableSearchConfig;