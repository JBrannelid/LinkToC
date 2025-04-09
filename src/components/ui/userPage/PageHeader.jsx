// PageHeader.jsx
import React from 'react';

const PageHeader = ({ className = "", children, id }) => {
    return (
        <header className={`px-6 pt-6 pb-2 ${className}`} id={id}>
            {children}
        </header>
    );
};

export default PageHeader;