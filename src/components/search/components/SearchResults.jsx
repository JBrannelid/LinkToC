import React, {useEffect, useRef, useCallback} from "react";
import {ListItemRenderer} from "../SearchResultRenderers.jsx";
import {useSearch} from "../../../context/searchContext.js";
import LoadingSpinner from "../../ui/LoadingSpinner.jsx";
import {FormMessage} from "../../forms/index.js";

const MemoizedListItem = React.memo(ListItemRenderer, (prev, next) => {
    return prev.isSelected === next.isSelected && prev.item[prev.config?.idField || 'id'] === next.item[next.config?.idField || 'id'];
});
const SearchResults = ({
                           className = '',
                           maxHeight = '20rem',
                           showWhenEmpty = false,
                           onItemSelect,
                           onItemFocus = null
                       }) => {
    const {
        results,
        loading,
        error,
        message,
        config,
        handleSelectItem,
        handleItemFocus: contextHandleItemFocus,
        isItemSelected,
        query,
        loadingState,
        isTyping
    } = useSearch();

    const resultsRef = useRef(null);
    
    const handleItemClick = useCallback((item) => {
        handleSelectItem(item);
        if (onItemSelect) {
            onItemSelect(item);
        }
    },[handleSelectItem,onItemSelect]);
    
    const handleItemFocus = useCallback( (item) => {
        if (onItemFocus) {
            onItemFocus(item);
        }
        if (contextHandleItemFocus) {
            contextHandleItemFocus(item);
        } else {
            handleSelectItem(item);
        }
    },[handleSelectItem,contextHandleItemFocus,onItemFocus]);
    
    useEffect(() => {
        if (resultsRef.current && results.length > 0) {
            resultsRef.current.scrollTop = 0;
        }
    }, [results]);

    if (!query && !showWhenEmpty && results.length === 0) {
        return null;
    }
    const ItemRenderer = config?.resultItemRenderer ? React.memo(config.resultItemRenderer) : MemoizedListItem;

    const renderResultItems = () => {
        if(results.length === 0) return null;
        
        const {layout = 'list', resultItemRenderer, columns = 1} = config || {};

        if (layout === 'grid') {
            const gridClass = columns === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap3' : 'grid grid-cols-1 gap-3';
            return (
                <div
                    className={gridClass}
                    role="listbox"
                    aria-label={`Search results for ${config?.entityType || 'items'}`}>
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
        } else {
            return (
                <ul className="space-y-2"
                    role="listbox"
                    aria-label={`Search results for ${config?.entityType || 'items'}`}>
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
        }
    };
    return (
        <div
            ref={resultsRef}
            id="search-results"
            className={`overflow-y-auto ${className}`}
            style={{maxHeight}}
            aria-live="polite">
            {loading && (
                <div className="p-4 flex flex-col items-center justify-center h-full">
                    <LoadingSpinner size="medium" className="text-primary mb-2" />
                    <p className="text-center text-gray-500">
                        {loadingState?.getMessage() || config?.loadingText || 'Searching...'}
                    </p>
                </div>
            )}
            {!loading && error && (
                <div className="h-full flex items-center justify-center">
                    <FormMessage
                        message={typeof error === 'string'
                            ? { type: 'error', text: error }
                            : (error.text ? error : { type: 'error', text: 'An error occurred during search' })}
                    />
                </div>
            )}
            {!loading && !error && results.length === 0 && query.trim().length > 0 && !isTyping && (
                <div className="p-4 h-full flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-600">{config?.noResultsText || 'No results found'}</p>
                    </div>
                </div>
            )}
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

            {!loading && !error && !message && results.length > 0 && (
                <div className="transition-opacity duration-200">
                    {renderResultItems()}
                </div>
            )}
        </div>
    );
};

export default SearchResults;