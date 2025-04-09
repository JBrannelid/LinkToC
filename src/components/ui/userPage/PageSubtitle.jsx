import React from 'react';

export const PageSubtitle = ({ children, className = '', id }) => {
    return (
        <h3 className={`text-sm font-medium text-gray-600 ${className}`} id={id}>
            {children}
        </h3>
    );
};