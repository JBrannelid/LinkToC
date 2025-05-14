import React, {useRef, useEffect, useCallback, useMemo, useState} from 'react';
import { useSearch } from '../../../context/searchContext.js';
import { ListItemRenderer } from '../SearchResultRenderers';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { FormMessage } from '../../forms/index';

const MemoizedListItem = React.memo(ListItemRenderer, (prev, next) => {
    return prev.isSelected === next.isSelected &&
        prev.item[prev.config?.idField || 'id'] === next.item[next.config?.idField || 'id'];
});

const SearchResults = (
    {
        className = '',
        maxHeight = '20rem',
        showWhenEmpty = false,
        onItemSelect,
        onItemFocus = null
    }) => {
    const {
        // State from search context
        results,
        loading,
        error,
        message,
        config,
        query,
        loadingState,

        // Handlers from search context
        handleSelectItem,
        handleItemFocus: contextHandleItemFocus,
        isItemSelected
    } = useSearch();

    const resultsRef = useRef(null);
    const prevQueryRef = useRef(query);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (loading) {

        } else if (results.length > 0) {
            
            const timer = setTimeout(() => {
                setShowResults(true);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setShowResults(false);
        }
    }, [loading, results.length]);
    
    useEffect(() => {
        // Only scroll when query changes AND we have results
        if (resultsRef.current && results.length > 0 && results.length !== prevQueryRef.current) {
            resultsRef.current.scrollTop = 0;
            prevQueryRef.current = results.length;
        }
    }, [results]);

    // Handle item click - propagate to parent if needed
    const handleItemClick = useCallback((item) => {
        // Set selection in context
        handleSelectItem(item);

        // Notify parent if callback provided
        if (onItemSelect) {
            onItemSelect(item);
        }
    }, [handleSelectItem, onItemSelect]);

    // Handle item focus events
    const handleItemFocus = useCallback((item) => {
        // Notify parent if callback provided
        if (onItemFocus) {
            onItemFocus(item);
        }

        // Use context handler if available
        if (contextHandleItemFocus) {
            contextHandleItemFocus(item);
        } else {
            // Default to selection handler
            handleSelectItem(item);
        }
    }, [handleSelectItem, contextHandleItemFocus, onItemFocus]);

    // Get the appropriate renderer component
    const ItemRenderer = config?.resultItemRenderer
        ? React.memo(config.resultItemRenderer)
        : MemoizedListItem;

    // Render search results based on layout configuration
    const renderedResults = useMemo(() => {
        if (results.length === 0) return null;

        const { layout = 'list', columns = 1 } = config || {};

        // Grid layout
        if (layout === 'grid') {
            const gridClass = columns === 2
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                : 'grid grid-cols-1 gap-3';

            return (
                <div
                    className={gridClass}
                    role="listbox"
                    aria-label={`Search results for ${config?.entityType || 'items'}`}
                >
                    {results.map((item, index) => (
                        <ItemRenderer
                            key={item[config?.idField || 'id'] || index}
                            item={item}
                            isSelected={isItemSelected(item)}
                            onSelect={handleItemClick}
                            onFocus={handleItemFocus}
                            onJoinStable={onItemSelect}
                            config={config}
                            index={index}
                            data-index={index}
                        />
                    ))}
                </div>
            );
        }

        // Default list layout
        return (
            <ul
                className="space-y-2"
                role="listbox"
                aria-label={`Search results for ${config?.entityType || 'items'}`}
            >
                {results.map((item, index) => (
                    <ItemRenderer
                        key={item[config?.idField || 'id'] || index}
                        item={item}
                        isSelected={isItemSelected(item)}
                        onSelect={handleItemClick}
                        onFocus={handleItemFocus}
                        onJoinStable={onItemSelect}
                        config={config}
                        index={index}
                        data-index={index}
                    />
                ))}
            </ul>
        );
    }, [results, config, isItemSelected, handleItemClick, handleItemFocus, onItemSelect, ItemRenderer]);
   
    const containerStyle = useMemo(() => ({
        maxHeight,
        minHeight: results.length > 0 ? '9rem' : 'auto',
        position: 'relative',
        overflow: results.length > 0 ? 'auto' : 'visible', // Allow overflow for messages
        transition: 'min-height 0.3s ease'
   
    }), [maxHeight, results.length]);
    return (
        <div
            ref={resultsRef}
            id="search-results"
            className={`overflow-y-auto transition-all duration-300 ${className}`}
            style={containerStyle}
            aria-live="polite"
        >
            
            {/* Loading state */}
            <div
                className={`p-4 flex flex-col items-center justify-center absolute inset-0 bg-white
                transition-opacity duration-200 ${loading ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
                <LoadingSpinner size="medium" className="text-primary mb-2" />
                <p className="text-center text-gray-500">
                    {loadingState?.getMessage() || config?.loadingText || 'Searching...'}
                </p>
            </div>

            {/* Error state */}
            <div
                className={`absolute inset-0 flex items-center justify-center bg-white
                transition-opacity duration-200 ${!loading && error ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
                <FormMessage
                    message={typeof error === 'string'
                        ? { type: 'error', text: error }
                        : (error?.text ? error : { type: 'error', text: 'An error occurred during search' })}
                />
            </div>

            {/* Empty results / No matches message */}
            <div
                className={`flex flex-col items-center justify-center w-full py-4
    transition-opacity duration-300 ${!loading && message ? 'opacity-100' : 'opacity-0'}`}
                role="alert"
                style={{
                    position: results.length > 0 ? 'absolute' : 'relative',
                    inset: results.length > 0 ? 0 : 'auto',
                    zIndex: message ? 10 : -1
                }}
            >
                <div>
                    <FormMessage message={message} />
                    {message && message.type === 'error' && message.text && message.text.includes("Can't find") && (
                        <div className="mt-3 text-sm">
                            <p>Suggestions:</p>
                            <ul className="list-disc pl-5 mt-1">
                                <li>Check for spelling errors</li>
                                <li>Try using fewer or different keywords</li>
                                <li>Try searching for part of the name</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Results display */}
            <div
                className={`transition-opacity duration-300 w-full
                ${!loading && !error && !message && results.length > 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
                {renderedResults}
            </div>
        </div>
    );
};

export default React.memo(SearchResults);