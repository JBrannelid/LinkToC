import {createSearchConfig} from "./searchConfigBase";
import {userService} from "../../../api/index.js";

const stableId = currentStable?.id;
const userSearchConfig = createSearchConfig({
    entityType: 'user',

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
            
            const response = await userService.searchUsers(params);

            
            if (!response || !response.isSuccess) {
                throw new Error(response?.message || 'Search failed');
            }
            
            return {
                success: response.isSuccess,
                data: response.data || [],
                message: response.message || 'Search completed'
            };
        } catch (error) {
            console.error('User search error:', error);
            throw error;
        }
    },
    
    idField: 'id',
    labelField: 'firstName',
    secondaryField: 'lastName',
    imageField: 'profileImage',
    
    placeholderText: 'Search for users...',
    actionButtonText: 'Select',
    cancelButtonText: 'Cancel',
    noResultsText: "Can't find any users with that name. Try another search.",
    errorText: 'An error occurred while searching for users. Try again later.',
    loadingText: 'Searching for users...',
    
    selectionMode: 'single',
});

export default userSearchConfig;