import React, { useMemo } from 'react';
import { useLocation } from 'react-router';
import { SearchContext } from '../../context/searchContext';
import { getConfigForRoutes } from './config/searchConfig';
import { useLoadingState } from '../../hooks/useLoadingState';
import useSearchState from "../search/hooks/useSearchState.js";

const SearchProvider = ({ children, customConfig = null }) => {
    const location = useLocation();

    // Get configuration
    const config = useMemo(() => {
        return customConfig || getConfigForRoutes(location.pathname);
    }, [customConfig, location.pathname]);

    // Use the hook for all search state and functionality
    const searchState = useSearchState(config);

    // Create loading state for messaging
    const loadingState = useLoadingState(searchState.isLoading, 'fetch');

    // Create context value object
    const contextValue = useMemo(() => ({
        ...searchState,              
        loading: searchState.isLoading,  
        loadingState,                
        config
    }),[
        searchState.query,
        searchState.results,
        searchState.selectedItem,
        searchState.isLoading,
        searchState.isTyping,
        searchState.error,
        searchState.message,
        loadingState,
        config
    ]);

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
};

export default React.memo(SearchProvider);