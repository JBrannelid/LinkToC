import React from 'react';

const PageContainer = ({
    id,
    className ="",
    children,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
}) => {
    return (
        <div
        id={id}
        role="page"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
            {children}
        </div>
    )
};

export default PageContainer;

