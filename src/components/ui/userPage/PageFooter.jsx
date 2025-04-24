// PageFooter.jsx
import React from 'react';

const PageFooter = ({ className = "", children, id, bordered = true }) => {
    const borderClass = bordered ? 'border-t border-gray-200' : '';

    return (
        <footer className={`px-4 py-3 ${borderClass} ${className}`} id={id}>
            {children}
        </footer>
    );
};

export default PageFooter;

