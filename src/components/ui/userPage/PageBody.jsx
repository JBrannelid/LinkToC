// PageBody.jsx

import React from "react";

export const PageBody = ({ className, children, id }) => {
    return (
        <div className={`p-4 ${className}`} id={id}>
            {children}
        </div>
    );
}
