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
                throw createErrorMessage('No response from server. Please try again.');
            }
            if(!response || !response?.isSuccess){
                throw getErrorMessage(response.error || {
                    message: response.message || 'Search failed'
                });
            }
            return {
                success: response.isSuccess,
                data: response.value || [],
                message: response.message || 'Search completed'
            };
        } catch (error) {
            console.error('Stable search error:',error);
            throw error;
        }
    },
    idField: 'id',
    labelField: 'name',
    secondaryField: 'county',

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