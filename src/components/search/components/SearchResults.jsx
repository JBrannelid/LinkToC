import React, {useRef, useEffect} from 'react';
import {useSearch} from "../../../context/searchContext";
import {FormMessage} from "../../forms/index";
import LoadingSpinner from "../../ui/LoadingSpinner";
import {ListItemRenderer} from "../config/searchResultRenderers.js";

const SearchResults = ({
                          className = '',
                          maxHeight = '20rem',
                          showWhenEmpty = false,
                          onItemSelect
                      }) => {
    const {
        results,
        loading,
        error,
        message,
        config,
        handleSelectItem,
        isItemSelected,
        query,
        loadingState
    } = useSearch();

    const resultsRef = useRef(null);
    const handleItemClick = (item) => {
        handleSelectItem(item);
        if(onItemSelect) {
            onItemSelect(item);
        }
    };
    useEffect(() => {
        if(resultsRef.current && results.length > 0){
            resultsRef.current.scrollTop = 0;
        }
    }, [results]);
    
    if (!query && !showWhenEmpty && results.length === 0) {
        return null;
    }
    
    const renderResults = () => {
        if (loading) {
            return(
                <div className="p-4 text-center text-gray flex flex-col items-center">
                    <LoadingSpinner size=medium className="text-primary mb-2"/>
                    <p>{loadingState?.getMessage() || config?.loadingText || 'Searching...'}</p>
                </div>
            );
        }
        if (error) {
            return (
                <FormMessage
                    message={{
                        type: 'error',
                        text: error
                    }}
                    />
            );
        }
        if (message){
            return <FormMessage message={message} />
        }
        if(results.length === 0 && query){
            return (
                <div className="p-4 text-center text-gray">
                    <p>{config?.noResultsText || 'No results found'}</p>
                </div>
            );
        }
        
        const {layout = 'list', resultItemRenderer, columns = 1} = config || {};
        
        if(layout === 'grid'){
            const gridClass = columns === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap3' : 'grid grid-cols-1 gap-3';
        return(
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
                            onSelectItem={handleItemClick}
                            config={config}
                            index={index}
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

                        // Use the custom renderer if provided or fall back to default list item
                        const ItemRenderer = resultItemRenderer || ListItemRenderer;

                        return (
                            <ItemRenderer
                                key={itemId || index}
                                item={item}
                                isSelected={isSelected}
                                onSelect={handleItemClick}
                                config={config}
                                index={index}
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
        className={`overflow-y-auto ${className}`}
        style={{maxHeight}}
        aria-live="polite">
            {renderResults()}
        </div>
    );
};

export default SearchResults;