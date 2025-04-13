import React, { useState, useEffect } from 'react';

const PageImage = ({ src, alt, fallbackSrc, ...props }) => {
    // Initialize with null instead of empty string if src is empty
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

    // Update imgSrc when src prop changes
    useEffect(() => {
        setImgSrc(src || null);
    }, [src]);

    // Handle image load errors
    const handleError = () => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        } else {
            // If no fallback or already showing fallback, set to null
            setImgSrc(fallbackSrc);
        }
    };

    // Don't render the img element if imgSrc is null
    if (imgSrc === null) {
        return null;
    }

    return (
        <img
            src={imgSrc}
            alt={alt || "Image"}
            onError={handleError}
            {...props}
        />
    );
};

export default PageImage;

