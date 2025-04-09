// PageFooter.jsx
import React from 'react';

const PageFooter = ({ className = "", children, id, bordered = true }) => {
    const borderClass = bordered ? 'border-t border-gray-100' : '';

    return (
        <footer className={`px-6 pb-6 pt-2 ${borderClass} ${className}`} id={id}>
            {children}
        </footer>
    );
};

export default PageFooter;