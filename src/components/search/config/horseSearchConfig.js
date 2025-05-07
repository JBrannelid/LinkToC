import { creatSearchConfig } from './searchConfigBase';

const horseSearchConfig = creatSearchConfig({
    entityType: 'horse',
    
    searchFn: async (query) => {
        try{
            //Add actual function here for ApiResponse based on structure
        } catch (error) {
            //Add error function here
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