// PageBody.jsx

import React from "react";

const PageBody = ({ className, children, id }) => {
    return (
        <div className={`p-4 ${className}`} id={id}>
            {children}
        </div>
    );
}

export default PageBody;
