import React, {createElement} from 'react';
import Button from "../ui/Button.jsx";
import {ConnectedDisplayDistance} from "../ui/DisplayDistance.jsx"
import StableIcon from "../../assets/icons/StableIcon.jsx";

export const ListItemRenderer = (
    {
        item,
        isSelected,
        onSelect,
        onFocus,
        config,
        onJoinStable,
        actionLabel = 'Join',
        index,
        onAction,
        ...props
    }) => {
    const primaryText = item[config?.labelField || 'name']
    const countyText = item.county || '';
    const imageUrl = item[config?.imageField || 'image'];
    const stableType = item.type || '';
    const handleFocus = () => {
        if (onFocus) {
            onFocus(item);
        }
    };
    const openModal = (e) => {
        e.stopPropagation();
        if (onJoinStable) {
            onJoinStable({
                stableId: item.id,
                stableName: item,
                action: 'join'
            });
        }
    };
    const handleButtonClick = (e) => {
        e.stopPropagation(); 
        openModal(e);
    };
    return (
        <li
            className={`group flex items-center justify-between p-3 border border-primary rounded-lg cursor-pointer mb-2 bg-white ${
                isSelected ? 'bg-primary-light' :  'bg-white hover:bg-primary-light'
            } focus:outline-none focus:ring-2 focus:ring-primary`}
            onClick={openModal}
            tabIndex={0}
            onFocus={handleFocus}
            onMouseEnter={(e) => {
                const button = e.currentTarget.querySelector('button');
                if (button) {
                    button.style.opacity = 1;
                }
            }}
            onMouseLeave={(e) => {
                const button = e.currentTarget.querySelector('button');
                if (button) {
                    button.style.opacity = isSelected ? 1 : 0;
                }
            }}
            data-index={index}
            aria-label={`${primaryText}, ${countyText || 'no county'}, ${stableType || 'stable'}, click to join`}
            {...props}
        >
            <div className="flex items-center flex-grow">
                
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border border-white">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`${primaryText}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <StableIcon className="w-7 h-7 text-primary bg-primary-light" />
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
                    {config?.entityType === 'stable' && item.latitude && item.longitude && (
                        <ConnectedDisplayDistance
                            latitude={item.latitude}
                            longitude={item.longitude}
                            distance={item.distance}
                            locationName={primaryText}
                        />
                    )}
                </div>
            </div>
            
                <Button
                    type="primary"
                    size="small"
                    className="ml-2 whitespace-nowrap transition-all duration-300"
                    style={{
                        opacity: isSelected ? 1 : 0,
                        transform: isSelected ? 'scale(1)' : 'scale(0.9)'
                    }}
                    onClick={handleButtonClick}
                    tabIndex={-1}
                    aria-hidden="true"
                    data-action-button="visual-indicator"
                >
                    {actionLabel || 'Join'}
                </Button>
            
        </li>
    );
};

export const MemoizedListItemRenderer = React.memo(
    ListItemRenderer,
    (prev, next) => {

        return (
            prev.isSelected === next.isSelected &&
            prev.item[prev.config?.idField || 'id'] === next.item[next.config?.idField || 'id'] &&
            prev.item[prev.config?.labelField || 'name'] === next.item[next.config?.labelField || 'name'] &&
            prev.item[prev.config?.secondaryField] === next.item[next.config?.secondaryField] &&
            prev.item.county === next.item.county &&
            prev.item.type === next.item.type
        );
    }
);
export default {
    ListItemRenderer,
    MemoizedListItemRenderer,
};