import React from 'react';

const PageSubtitle = ({ children, className = '', id }) => {
    return (
        <h3 className={`text-sm font-medium text-gray-600 ${className}`} id={id}>
            {children}
        </h3>
    );
};
export default PageSubtitle;