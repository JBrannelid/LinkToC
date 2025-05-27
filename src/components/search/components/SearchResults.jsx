import React, {useRef, useEffect, useCallback, useMemo, useState} from 'react';
import { useSearch } from '../../../context/searchContext.js';
import { FormMessage } from '../../forms/index';
import LoadingSpinner from '../../ui/LoadingSpinner';
import SearchRenderers from '../SearchResultRenderers';
const { ListItemRenderer } = SearchRenderers;
const MemoizedListItem = React.memo(ListItemRenderer, (prev, next) => {
    return prev.isSelected === next.isSelected &&
        prev.item[prev.config?.idField || 'id'] === next.item[next.config?.idField || 'id'];
});

const SearchResults = (
    {
        className = '',
        maxHeight = '20rem',
        onItemSelect,
        onItemFocus = null
    }) => {
    const {
        results,
        loading,
        error,
        message,
        config,
        query,
        loadingState,
        
        handleSelectItem,
        handleItemFocus: contextHandleItemFocus,
        isItemSelected
    } = useSearch();

    const resultsRef = useRef(null);
    const prevQueryRef = useRef(query);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (loading) {
        setShowResults(false);
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
        if (resultsRef.current && results.length > 0 && results.length !== prevQueryRef.current) {
            resultsRef.current.scrollTop = 0;
            prevQueryRef.current = results.length;
        }
    }, [results]);

    
    const handleItemClick = useCallback((item) => {
        handleSelectItem(item);
        if (onItemSelect) {
            onItemSelect(item);
        }
    }, [handleSelectItem, onItemSelect]);

    
    const handleItemFocus = useCallback((item) => {
        if (onItemFocus) {
            onItemFocus(item);
        }
        if (contextHandleItemFocus) {
            contextHandleItemFocus(item);
        } else {
            handleSelectItem(item);
        }
    }, [handleSelectItem, contextHandleItemFocus, onItemFocus]);
    
    const ItemRenderer = config?.resultItemRenderer || MemoizedListItem;
    
    const renderedResults = useMemo(() => {
        if (results.length === 0) return null;

        const { layout = 'list', columns = 1 } = config || {};
        
        if (layout === 'grid') {
            const gridClass = columns === 2
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                : 'grid grid-cols-1 gap-3';

            return (
                <div
                    className={gridClass}
                    role="region"
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
        return (
            <ul
                className="space-y-2"
                role="list"
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
    }, [results, config, isItemSelected, handleItemClick, handleItemFocus, onItemSelect]);
   
    const containerStyle = useMemo(() => ({
        maxHeight,
        minHeight: results.length > 0 ? '9rem' : 'auto',
        position: 'relative',
        overflow: results.length > 0 ? 'auto' : 'visible',
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
            {loading && (
                <div className="p-4 flex flex-col items-center justify-center"
                >
                    <LoadingSpinner size="medium" className="text-primary mb-2" />
                    <p className="text-center text-gray-500">
                        {loadingState?.getMessage() || config?.loadingText || 'Searching...'}
                    </p>
                </div>
            )}


            {/* Error state */}
            {!loading && error && (
                <div className="flex items-center justify-center p-4"
                >
                    <FormMessage
                        message={typeof error === 'string'
                            ? { type: 'error', text: error }
                            : (error?.text ? error : { type: 'error', text: 'An error occurred during search' })}
                    />
                </div>  
            )}


            {/* Empty results / No matches message */}
            {!loading && !error && message && (
                <div className="flex flex-col items-center justify-center w-full py-4"
                    role="alert"
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
            )}
            

            {/* Results display */}
            {!loading && !error && !message && showResults && (
                <div
                    className="transition-opacity duration-300 w-full"
 
                >
                    {renderedResults}
                </div> 
            )}

        </div>
    );
};

export default React.memo(SearchResults);