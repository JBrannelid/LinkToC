const baseSearchConfig = {
    entityType: 'generic',

    searchFn: null,

    idField: 'id',
    labelField: 'name',
    secondaryField: 'description',
    imageField: 'image',

    placeHolderText: 'Search for...',
    actionButton: 'Select',
    cancelButton: 'Cancel',
    noResultsText: 'No results found. Try another search term.',
    errorText: 'An error occurred while searching. Please try again.',
    loadingText: 'Searching...',

    selectionMode: 'single',

    searchParams: {
        page: 0,
        pageSize: 10,
    }
};

export const createSearchConfig = (config) => {
    if (!config.entityType) {
        console.warn('Search config is missing entityType');
    }
    if (!config.searchFn) {
        console.warn(`Search config for ${config.entityType || 'unknown'} is missing searchFn`);
    }
    return {
        ...baseSearchConfig,
        ...config,
    };
};

export default baseSearchConfig;