import {ListItemRenderer} from "../SearchResultRenderers.jsx";
import {useEffect, useRef} from "react";
import {useSearch} from "../../../context/searchContext.js";
import LoadingSpinner from "../../ui/LoadingSpinner.jsx";
import {FormMessage} from "../../forms/index.js";

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
    const handleItemClick = (item) => {
        handleSelectItem(item);
        if (onItemSelect) {
            onItemSelect(item);
        }
    };
    const handleItemFocus = (item) => {
        if (onItemFocus) {
            onItemFocus(item);
        }
        if (contextHandleItemFocus) {
            contextHandleItemFocus(item);
        } else {
            handleSelectItem(item);
        }
    };
    useEffect(() => {
        if (resultsRef.current && results.length > 0) {
            resultsRef.current.scrollTop = 0;
        }
    }, [results]);

    if (!query && !showWhenEmpty && results.length === 0) {
        return null;
    }

    const renderResults = () => {
        if (loading) {
            return (
                <div className="p-4 text-center text-gray flex flex-col items-center">
                    <LoadingSpinner size="medium" className="text-primary mb-2"/>
                    <p>{loadingState?.getMessage() || config?.loadingText || 'Searching...'}</p>
                </div>
            );
        }
        if (error) {
            const errorMessage = typeof error === 'string'
                ? {type: 'error', text: error}
                : (error.text ? error : {type: 'error', text: 'An error occurred during search'});

            return (
                <FormMessage
                    message={errorMessage}
                />

            );
        }
        if (query.trim().length > 0 && query.trim().length < 3 && !isTyping) {
            return (
                <div className="p-4 text-center text-gray-500 ">
                    <p className="text-sm">
                        Please enter at least 3 characters to start searching
                    </p>
                </div>
            );
        }
        if (results.length === 0 && query.trim().length >= 3 && !isTyping) {
            return (
                <div className="p-4 text-center text-gray">
                    <p>{config?.noResultsText || 'No results found'}</p>
                </div>
            );
        }
        if (message) {
            return (
                <div role="alert">
                    <FormMessage message={message}/>
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
            );
        }
        if (!query && !showWhenEmpty && results.length === 0) {
            return null;
        }

        const {layout = 'list', resultItemRenderer, columns = 1} = config || {};

        if (layout === 'grid') {
            const gridClass = columns === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap3' : 'grid grid-cols-1 gap-3';
            return (
                <div
                    className={gridClass}
                    role="listbox"
                    aria-label={`Search results for ${config?.entityType || 'items'}`}>
                    {results.map((item, index) => {
                        const itemId = item[config?.idField || 'id'];
                        const isSelected = isItemSelected(item);

                        const ItemRenderer = resultItemRenderer || ListItemRenderer;

                        return (
                            <ItemRenderer
                                key={itemId || index}
                                item={item}
                                isSelected={isSelected}
                                onSelect={handleItemClick}
                                onFocus={handleItemFocus}
                                onJoinStable={onItemSelect}
                                config={config}
                                index={index}
                                data-index={index}
                            />
                        );
                    })}
                </div>
            );
        } else {
            return (
                <ul className="space-y-2"
                    role="listbox"
                    aria-label={`Search results for ${config?.entityType || 'items'}`}>
                    {results.map((item, index) => {
                        const itemId = item[config?.idField || 'id'];
                        const isSelected = isItemSelected(item);

                        const ItemRenderer = resultItemRenderer || ListItemRenderer;

                        return (
                            <ItemRenderer
                                key={itemId || index}
                                item={item}
                                isSelected={isSelected}
                                onSelect={handleItemClick}
                                onFocus={handleItemFocus}
                                onJoinStable={onItemSelect}
                                config={config}
                                index={index}
                                data-index={index}
                            />
                        );
                    })}
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
            {renderResults()}
        </div>
    );
};

export default SearchResults;