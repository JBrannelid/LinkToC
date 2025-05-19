import {useState, useCallback, useRef, useEffect, useMemo} from 'react';

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
        
        if (newValue === query) return;
        // Update query state immediately for responsive UI
        setQuery(newValue);
        prevQueryRef.current = newValue;

        // Clear any scheduled searches
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }

        // Handle empty query immediately
        if (!newValue.trim()) {
            setIsTyping(false);
            resetSearch();
            return;
        }

        // Show typing indicator
        setIsTyping(true);

        // Use consistent debounce time
        const DEBOUNCE_TIME = 400; // milliseconds

        // Schedule search with single, predictable timeout
        searchTimeoutRef.current = setTimeout(() => {
            if (newValue.trim()) {
                setIsTyping(false);
                performSearch(newValue);
            }
        }, DEBOUNCE_TIME);
    }, [performSearch, resetSearch, query]);


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
    return useMemo(() => ({
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
    }), [
        query, results, selectedItem, isLoading, isTyping, error, message,
        handleInputChange, handleSelectItem, isItemSelected, resetSearch, performSearch,
        config
    ]);
}

export default useSearchState;