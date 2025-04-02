import React from 'react';

const CardContainer = ({
                           id,
                           className = "",
                           children,
                           ariaLabel,
                           ariaLabelledby,
                           ariaDescribedby
                       }) => {
    return (
        <div
            id={id}
            role="article"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            className={`border rounded-lg shadow-md overflow-hidden max-w-md bg-white ${className}`}
        >
            {children}
        </div>
    );
};

export default CardContainer;