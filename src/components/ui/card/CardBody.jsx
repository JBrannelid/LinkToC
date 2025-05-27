// CardBody.jsx
import React from "react";

const CardBody = ({ className = "", children, id }) => {
  return (
    <div className={`px-6 py-4 text-gray-800 ${className}`} id={id}>
      {children}
    </div>
  );
};

export default CardBody;
