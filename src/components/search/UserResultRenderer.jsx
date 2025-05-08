import React from 'react'
import Card from '../ui/card/index.js'

const UserResultRenderer = ({item, isSelected, onSelect, config}) => {
    const firstName = item[config?.labelField || 'firstName'] || '';
    const lastName = item[config?.secondaryField || 'lastName'] || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unnamed user';
    const imageUrl = item[config?.imageField || 'profileImage'];
    const age = item.age || '';
    const horseName = item.horseName || '';

    const handleClick = () => {
        onSelect(item);
    };
    
    const placeholderImage = 'src/src/assets/images/userPlaceholder.jpg'
    
    return (
        <div
            className={`cursor-pointer transition-all duration-200 min-h-[72px] ${
                isSelected ? 'ring-2 ring-primary' : 'hover:translate-y-[-2px]'
            }`}
            onClick={handleClick}
            role="option"
            aria-selected={isSelected}
        >
            <Card.Container className="h-full">
                <div className="flex items-center p-3 min-h-[72px]">
                    {/* User profile image - fixed size for consistent touch target */}
                    <div className="w-14 h-14 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-light">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={`Profile of ${fullName}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <img
                                src={placeholderImage}
                                alt="User placeholder"
                                className="w-full h-full object-cover opacity-60"
                            />
                        )}
                    </div>

                    {/* User information with text truncation for mobile */}
                    <div className="flex-grow min-w-0">
                        {/* Full name with truncation */}
                        <div className="font-bold truncate">{fullName}</div>

                        {/* Age with spacing for small screens */}
                        {age && (
                            <div className="text-sm mt-0.5">{age} år</div>
                        )}

                        {/* Associated horse with truncation */}
                        {horseName && (
                            <div className="text-xs text-gray-600 mt-0.5 truncate">{horseName}</div>
                        )}
                    </div>
                </div>
            </Card.Container>
        </div>
    );
};

export default UserResultRenderer;