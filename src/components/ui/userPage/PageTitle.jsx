import React from 'react';

const PageTitle = ({ children, className = '' , id}) => {
    return (
        <h2 className={`text-xl font-semibold text-gray-800 ${className}`} id={id}>
            {children}
        </h2>
    );
};

export default PageTitle;