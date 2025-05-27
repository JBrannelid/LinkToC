import React, {useState} from 'react';
import StableIcon from "../../assets/icons/StableIcon.jsx";
import Button from "../ui/Button.jsx";
import {ConnectedDisplayDistance} from "../ui/DisplayDistance.jsx"

export const ListItemRenderer = (
    {
        item,
        isSelected,
        config,
        onJoinStable,
        actionLabel = 'Join',
        index,
        ...props
    }) => {
    const [_isOpening, setIsOpening] = useState(false);
    const [_isFocused, setIsFocused] = useState(false);
    const primaryText = item[config?.labelField || 'name']
    const countyText = item.county || '';
    const imageUrl = item[config?.imageField || 'image'];
    const stableType = item.type || '';

    const openModal = (e) => {
        e.stopPropagation();
        const delay = window.innerWidth < 768 ? 500 : 400;
        setTimeout(() => {
            if (onJoinStable) {
                onJoinStable({
                    stableId: item.id,
                    stableName: item,
                    action: 'join'
                });
            }
            setIsOpening(false);
        },delay);
       
    };
    const handleButtonClick = (e) => {
        e.stopPropagation(); 
        openModal(e);
    };
    const baseClasses = "group flex items-center justify-between p-3 border border-primary rounded-lg cursor-pointer mb-2 bg-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 active:scale-96 active:bg-primary-light";
    const selectedClasses = isSelected ? "bg-primary-light hover:bg-primary active:bg-primary" : "";
    return (
        <li
            
            className={`${baseClasses} ${selectedClasses}`}
            onClick={openModal}
            tabIndex={0}
            onFocus={(e) => {
                setIsFocused(true);
                const button = e.currentTarget.querySelector('button');
                if (button) {
                    button.style.opacity = 1;
                    button.style.transform = 'scale(1)';
                }
            }}
            onBlur={(e) => {
                setIsFocused(false);
                const button = e.currentTarget.querySelector('button');
                if (button) {
                    if (window.innerWidth >= 768) {
                        button.style.opacity = isSelected ? 1 : 0;
                    }
                }
            }}
            onMouseEnter={(e) => {
                const button = e.currentTarget.querySelector('button');
                if (button) {
                    button.style.opacity = 1;
                }
            }}
            onMouseLeave={(e) => {
                const button = e.currentTarget.querySelector('button');
                if (button) {
                    button.style.opacity = 0;
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
                    onClick={handleButtonClick}
                    style={{
                        opacity: window.innerWidth < 768 ? 1 : 0,
                    }}
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