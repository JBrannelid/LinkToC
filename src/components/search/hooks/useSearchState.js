import { useState, useCallback, useRef, useEffect } from 'react';

function useSearchState(config) {
    // Core state - simplified for single selection only
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    // References for tracking state across renders
    const activeSearchRef = useRef(null);
    const prevQueryRef = useRef('');
    const searchTimeoutRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const performSearch = useCallback(async (searchTerm) => {
        if (!searchTerm.trim() || !config?.searchFn) return;

        // Track this search request
        const searchId = Date.now();
        activeSearchRef.current = searchId;

        setIsLoading(true);
        setError(null);

        try {
            // Call the search function
            const response = await config.searchFn(searchTerm);

            // Skip processing if this is a stale request
            if (activeSearchRef.current !== searchId) return;

            // Process successful response
            if (response?.success) {
                // Set results
                setResults(response.data || []);

                // Handle result state
                if (response.data && response.data.length > 0) {
                    setSelectedItem(response.data[0]);
                    setMessage(null);
                } else {
                    // No results found
                    setSelectedItem(null);
                    setMessage({
                        type: 'error',
                        text: config.noResultsText || 'No results found'
                    });
                }
            } else {
                // Failed search
                setResults([]);
                setSelectedItem(null);
                setMessage({
                    type: 'error',
                    text: response.message || config.noResultsText || 'No results found'
                });
            }
        } catch (err) {
            // Handle errors (only if this is still the active search)
            if (activeSearchRef.current === searchId) {
                console.error('Search error:', err);
                setError(err);
                setResults([]);
                setSelectedItem(null);
            }
        } finally {
            // Update loading state (only if this is still the active search)
            if (activeSearchRef.current === searchId) {
                setIsLoading(false);
            }
        }
    }, [config]);
    
    const resetSearch = useCallback(() => {
        // Clear any pending searches
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }

        // Reset state
        setResults([]);
        setSelectedItem(null);
        setError(null);
        setMessage(null);

        // Cancel any pending search requests
        activeSearchRef.current = null;
    }, []);
    
    const handleInputChange = useCallback((e) => {
        const newValue = e.target.value;
        const prevValue = prevQueryRef.current;
        const isDeleting = newValue.length < prevValue.length;

        // Update state
        setQuery(newValue);
        prevQueryRef.current = newValue;

        // Clear any scheduled searches
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }

        // Handle empty query
        if (!newValue.trim()) {
            setIsTyping(false);
            resetSearch();
            return;
        }

        // Show typing indicator
        setIsTyping(true);

        // Use different debounce times based on action
        const debounceTime = isDeleting ? 800 : 400;

        // Schedule search
        searchTimeoutRef.current = setTimeout(() => {
            // Special case: Short text while deleting
            if (isDeleting && newValue.length <= 2) {
                // Add extra delay
                searchTimeoutRef.current = setTimeout(() => {
                    // Only search if query hasn't changed during delay
                    if (newValue === query && newValue.trim()) {
                        setIsTyping(false);
                        performSearch(newValue);
                    }
                }, 500);
            } else {
                // Standard search
                setIsTyping(false);
                performSearch(newValue);
            }
        }, debounceTime);
    }, [query, performSearch, resetSearch]);


    const handleSelectItem = useCallback((item) => {
        if (item) {
            setSelectedItem(item);
        }
    }, []);
    
    const isItemSelected = useCallback((item) => {
        if (!item || !selectedItem) return false;
        return item[config?.idField || 'id'] === selectedItem[config?.idField || 'id'];
    }, [selectedItem, config?.idField]);

    // Return all necessary state and handlers
    return {
        // State
        query,
        results,
        selectedItem,
        isLoading,
        isTyping,
        error,
        message,

        // Handlers
        handleInputChange,
        handleSelectItem,
        setSelectedItem,       // Direct setter for external use
        isItemSelected,
        resetSearch,
        performSearch,

        // Config reference
        config
    };
}

export default useSearchState;