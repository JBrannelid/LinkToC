import React, {createElement} from 'react';
import Button from "../../ui/Button.jsx";

export const ListItemRenderer = ({
    item,
    isSelected,
    onSelect,
    config,
    actionLabel = 'Join'
}) => {
    const primaryText = item[config?.labelField || 'name']
    const secondaryText = item[config?.secondary];
    
    return (
        <li
            className="flex items-center justify-between p-3 border rounded-lg mb-2"
            role="option"
            aria-selected={isSelected}
        >
            <div className="flex items-center flex-grow">
                {/* Placeholder circle (could be an icon or image) */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>

                <div className="ml-3 flex-grow min-w-0">
                    <div className="font-medium text-base truncate">{primaryText}</div>
                    {secondaryText && (
                        <div className="text-sm text-gray-600 truncate">{secondaryText}</div>
                    )}
                </div>
            </div>

            <Button
                type="primary"
                size="small"
                className="ml-2 whitespace-nowrap"
                onClick={() => onSelect(item)}
                aria-pressed={isSelected}
            >
                {actionLabel || 'Join'}
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