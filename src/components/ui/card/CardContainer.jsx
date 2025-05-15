import React from "react";

const CardContainer = ({
  id,
  className = "",
  children,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  onClick,
}) => {
  return (
    <div
      id={id}
      role="article"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      className={`border border-primary rounded-lg shadow-md overflow-hidden max-w-md bg-white ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default CardContainer;
