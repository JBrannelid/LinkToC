// PageHeader.jsx
import React from 'react';

export const PageHeader = ({ className = "", children, id }) => {
    return (
        <header className={`px-4 py-3 border-b border-gray-200 ${className}`} id={id}>
            {children}
        </header>
    );
};

