// PageBody.jsx

import React from "react";

const PageBody = ({ className, children, id }) => {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
}
export default PageBody;