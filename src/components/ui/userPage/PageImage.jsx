import React, {useState } from 'react';

const PageImage = ({
    src,
    alt,
    className = "",
    loading = "lazy"
}) => {
    if (!alt) {
        console.warn("PageImage: Missing alt text for image accessibility");
    }
    return (
        <div className="w-full h-64 overflow-hidden">
            <img
                src={src}
                alt={alt}
                loading={loading}
                className={`w-full h-full object-contain ${className}`}
            />
        </div>
    );
   
};

export default PageImage;