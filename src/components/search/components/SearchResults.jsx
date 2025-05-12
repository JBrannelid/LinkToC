import React, { useRef, useEffect, useCallback } from 'react';
import { useSearch } from '../../../context/searchContext.js';
import { ListItemRenderer } from '../SearchResultRenderers';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { FormMessage } from '../../forms/index';

const MemoizedListItem = React.memo(ListItemRenderer, (prev, next) => {
    return prev.isSelected === next.isSelected &&
        prev.item[prev.config?.idField || 'id'] === next.item[next.config?.idField || 'id'];
});

const SearchResults = ({
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

    // Scroll to top when results change
    useEffect(() => {
        if (resultsRef.current && results.length > 0) {
            resultsRef.current.scrollTop = 0;
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

    // Show empty state prompt when no search has been performed
    // if (!query.trim() && results.length === 0 && !error && !message && !showWhenEmpty) {
    //     return (
    //         <div className={`p-4 text-center text-gray-500 ${className}`}>
    //             {config?.emptySearchPrompt || "Enter a search term to begin"}
    //         </div>
    //     );
    // }

    // Get the appropriate renderer component
    const ItemRenderer = config?.resultItemRenderer
        ? React.memo(config.resultItemRenderer)
        : MemoizedListItem;

    // Render search results based on layout configuration
    const renderResultItems = () => {
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
    };

    return (
        <div
            ref={resultsRef}
            id="search-results"
            className={`overflow-y-auto ${className}`}
            style={{ maxHeight }}
            aria-live="polite"
        >
            {/* Loading state */}
            {loading && (
                <div className="p-4 flex flex-col items-center justify-center h-full">
                    <LoadingSpinner size="medium" className="text-primary mb-2" />
                    <p className="text-center text-gray-500">
                        {loadingState?.getMessage() || config?.loadingText || 'Searching...'}
                    </p>
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className="h-full flex items-center justify-center">
                    <FormMessage
                        message={typeof error === 'string'
                            ? { type: 'error', text: error }
                            : (error.text ? error : { type: 'error', text: 'An error occurred during search' })}
                    />
                </div>
            )}

            {/* Empty results / No matches message */}
            {!loading && !error && message && (
                <div role="alert" className="h-full flex items-center justify-center">
                    <div>
                        <FormMessage message={message} />
                        {message.type === 'error' && message.text.includes("Can't find") && (
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
            )}

            {/* Results display */}
            {!loading && !error && !message && results.length > 0 && (
                <div className="transition-opacity duration-200">
                    {renderResultItems()}
                </div>
            )}
        </div>
    );
};

export default SearchResults;