import React from 'react';

export const PageImage = ({ src, alt, fallbackSrc, className = '',}) => {
    const [imgSrc, setImgSrc] = React.useState(src);
    const [isError, setIsError] = React.useState(false);

    const handleError = () => {
        if (!isError && fallbackSrc) {
            setImgSrc(fallbackSrc);
            setIsError(true);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <img
                src={imgSrc}
                alt={alt}
                onError={handleError}
                className="w-full h-full object-cover"
            />
            {isError && (
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 text-yellow-800 text-xs px-2 py-1">
                    Using placeholder image
                </div>
            )}
        </div>
    );
};