import React, { useMemo } from "react";
import { useLocation } from "react-router";
import { SearchContext } from "../../context/searchContext";
import { getConfigForRoutes } from "./config/searchConfig";
import { useLoadingState } from "../../hooks/useLoadingState";
import useSearchState from "../../hooks/useSearchState.js";
import { useStableSearchWithDistance } from "../../hooks/useStableSearch.js";

const SearchProvider = ({ children, customConfig = null }) => {
  const location = useLocation();

  // Get base configuration
  const baseConfig = useMemo(() => {
    return customConfig || getConfigForRoutes(location.pathname);
  }, [customConfig, location.pathname]);
  
  const isStableSearch = baseConfig?.entityType === "stable";

  // Get enhanced configuration for stables, or use base config for other entities
  const { searchConfig } = isStableSearch
    ? useStableSearchWithDistance()
    : { searchConfig: baseConfig };

 
  const searchState = useSearchState(searchConfig);
  
  const loadingState = useLoadingState(searchState.isLoading, "fetch");

 
  const contextValue = useMemo(
    () => ({
      ...searchState,
      loading: searchState.isLoading,
      loadingState,
      config: searchConfig, // Use searchConfig here
    }),
    [searchState, loadingState, searchConfig]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export default React.memo(SearchProvider);
