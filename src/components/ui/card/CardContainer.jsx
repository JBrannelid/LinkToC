import { motion } from "framer-motion";
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
    <motion.div
      id={id}
      role="article"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      className={`border border-primary rounded-lg shadow-md overflow-hidden max-w-md bg-white ${className}`}
      onClick={onClick}
      whileHover={
        onClick
          ? {
              y: -2,
              scale: 1.02,
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            }
          : {}
      }
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default CardContainer;
