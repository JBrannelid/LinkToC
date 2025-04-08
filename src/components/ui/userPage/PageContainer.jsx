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
        className={`max-w-md ${className}`}>
            {children}
        </div>
    )
};

export default PageContainer;