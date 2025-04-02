// CardSubtitle.jsx
import React from 'react';

const CardSubtitle = ({ className = "", children, id }) => {
    return (
        <div className={`text-gray-600 mt-1 ${className}`} id={id}>
            {children}
        </div>
    );
};

export default CardSubtitle;