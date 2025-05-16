import React, { useMemo } from 'react';
import { useLocation } from 'react-router';
import { SearchContext } from '../../context/searchContext';
import { getConfigForRoutes } from './config/searchConfig';
import { useLoadingState } from '../../hooks/useLoadingState';
import useSearchState from "../search/hooks/useSearchState.js";
import { useStableSearchWithDistance} from "./hooks/useStableSearch.js";

const SearchProvider = ({ children, customConfig = null }) => {
    const location = useLocation();

    // Get base configuration
    const baseConfig = useMemo(() => {
        return customConfig || getConfigForRoutes(location.pathname);
    }, [customConfig, location.pathname]);

    // Check if this is a stable search
    const isStableSearch = baseConfig?.entityType === 'stable';

    // Get enhanced configuration for stables, or use base config for other entities
    const { searchConfig } = isStableSearch
        ? useStableSearchWithDistance()
        : { searchConfig: baseConfig };

    // Log for debugging
    console.log("SearchProvider - isStableSearch:", isStableSearch);
    console.log("SearchProvider - using enhanced config:", searchConfig !== baseConfig);

    // Use searchState hook with the appropriate config
    const searchState = useSearchState(searchConfig);

    // Create loading state for messaging
    const loadingState = useLoadingState(searchState.isLoading, 'fetch');

    // Create context value object
    const contextValue = useMemo(() => ({
        ...searchState,
        loading: searchState.isLoading,
        loadingState,
        config: searchConfig  // Use searchConfig here
    }),[
        searchState,
        loadingState,
        searchConfig
    ]);

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
};

export default React.memo(SearchProvider);