
import React from 'react';

const PageHeader = ({ className = "", children, id }) => {
    return (
        <header className={`px-4 py-3 border-b border-gray-200 ${className}`} id={id}>
            {children}
        </header>
    );
};

export default PageHeader;

