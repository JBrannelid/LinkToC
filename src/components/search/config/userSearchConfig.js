import {createSearchConfig} from "./searchConfigBase";

const userSearchConfig = createSearchConfig({
    entityType: 'user',

    searchFn: async (query) => {
        try{
            //Add actual function here for ApiResponse based on structure
        } catch (error) {
            //Add error function here
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