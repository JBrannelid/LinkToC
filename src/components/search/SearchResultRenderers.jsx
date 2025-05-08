import React, {createElement, useState} from 'react';
import Button from "../ui/Button.jsx";

export const ListItemRenderer = ({
    item,
    isSelected,
    onSelect,
    onFocus,
    config,
    actionLabel = 'Join',
    index,
    ...props
}) => {
    const primaryText = item[config?.labelField || 'name']
    const countyText = item.county || '';
    const imageUrl = item[config?.imageField || 'image'];
    const stableType = item.type || '';
    const handleFocus = () => {
        if(onFocus){
            onFocus(item);
        }
    };
    
    const placeholderImage = '/src/assets/images/stablePlaceholder.jpg'
    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                // Focus next item
                event.preventDefault();
                const nextItem = document.querySelector(`[data-index="${index + 1}"]`);
                if (nextItem) {
                    nextItem.focus();
                }
                break;

            case 'ArrowUp':
                // Focus previous item or search input
                event.preventDefault();
                if (index > 0) {
                    const prevItem = document.querySelector(`[data-index="${index - 1}"]`);
                    if (prevItem) {
                        prevItem.focus();
                    }
                } else {
                    // If at first item, go back to search input
                    const searchInput = document.querySelector('[role="searchbox"]');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }
                break;

            case 'Enter':
                // Select this item and trigger its action
                event.preventDefault();
                onSelect(item);

                // After selecting, find and click the primary action button
                setTimeout(() => {
                    const actionButton = document.querySelector('button[type="primary"]');
                    if (actionButton) {
                        actionButton.click();
                    }
                }, 10);
                break;
        }
    };
    return (
        <li
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer mb-2 bg-white ${
                isSelected ? 'border-primary bg-primary-light' : 'border-light hover:bg-light'
            }focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            data-index={index}
            {...props}
        >
            <div className="flex items-center flex-grow">
                {/* Placeholder circle (could be an icon or image) */}
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-light">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`${primaryText}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <img
                            src={placeholderImage}
                            alt="Stable placeholder"
                            className="w-full h-full object-cover opacity-60"
                        />
                    )}
                </div>
                <div className="ml-3 flex-grow min-w-0">
                    <div className="font-medium text-base truncate">{primaryText}</div>
                    {countyText && (
                        <div className="text-sm text-gray-600 truncate">{countyText}</div>
                    )}
                    {stableType && (
                        <div className="text-xs text-gray-600 truncate">{stableType}</div>
                    )}
                </div>
            </div>

            <Button
                type={isSelected ?'primary' : 'secondary'}
                size="small"
                className={`ml-2 whitespace-nowrap transition-colors duration-200 
                    ${!isSelected && 'group-hover:bg-primary group-hover:text-white group-hover:border-primary'}`}
                onClick={() => onSelect(item)}
                aria-pressed={isSelected}
                data-action-button={isSelected ? 'primary' : 'secondary'}
            >
                {isSelected ? (actionLabel || 'Join') : 'Select'}
            </Button>
        </li>
    );
};

export const GridRenderer = ({
    items,
    itemRenderer,
    onSelect,
    config,
    columns = 1
}) => {
    const gridClassName = `grid gap-4 ${
        columns === 1 ? '' :
            columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
    }`;
    
    return(
        <div className={gridClassName}>
            {items.map((item, index) => (
                createElement(itemRenderer, {
                    key: item[config?.idField || 'id'] || index, item,
                    isSelected: false,
                    onSelect,
                    config,
                })
            ))}
            
        </div>
    );
};
export default {
    ListItemRenderer,
    GridRenderer
};