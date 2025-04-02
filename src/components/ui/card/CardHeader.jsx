// CardHeader.jsx
import React from 'react';

const CardHeader = ({ className = "", children, id }) => {
    return (
        <header className={`px-6 pt-6 pb-2 ${className}`} id={id}>
            {children}
        </header>
    );
};

export default CardHeader;