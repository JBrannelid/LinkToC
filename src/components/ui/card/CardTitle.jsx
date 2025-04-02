// CardTitle.jsx
import React from 'react';

const CardTitle = ({ className = "", children, id, level = 3 }) => {
    const Heading = `h${level}`;

    return (
        <Heading className={`text-xl font-bold ${className}`} id={id}>
            {children}
        </Heading>
    );
};

export default CardTitle;