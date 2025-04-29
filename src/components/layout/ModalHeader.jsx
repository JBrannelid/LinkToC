import React from "react";
import { X, LogOut } from "lucide-react";
import Button from "../ui/Button";

const ModalHeader = ({
  title,
  className = "",

  // Close btn
  showCloseBtn = false,
  closeBtn = <X strokeWidth={4} />,
  CloseAriaLabel = "Close module",
  onCloseClick,

  // Setting btn
  showGearButton = false,
  gearBtn = <LogOut />,
  gearAriaLabel = "Open Settings",
  onGearClick,
}) => {
  return (
    <div className={`relative bg-primary-light py-5 ${className}`}>
      {/* close btn */}
      {showCloseBtn && (
        <Button
          variant="icon"
          className="absolute left-4 top-4 border-0 text-primary"
          aria-label={CloseAriaLabel}
          onClick={onCloseClick}
        >
          {closeBtn}
        </Button>
      )}

      {/* Setting btn */}
      {showGearButton && (
        <Button
          variant="icon"
          className="absolute left-4 top-4 border-0 text-primary"
          aria-label={gearAriaLabel}
          onClick={onGearClick}
        >
          {gearBtn}
        </Button>
      )}

      <h1 className="text-center text-xl uppercase">{title}</h1>
    </div>
  );
};

export default ModalHeader;
