import React from "react";
import Button from "../ui/Button";
import SettingIcon from "../../assets/icons/SettingIcon";
import CloseIcon from "../../assets/icons/CloseIcon";

const ModalHeader = ({
  // Button configuration
  title,
  className = "",
  render = "left", // "left/right

  // Close btn
  showCloseBtn = false,
  closeBtn = <CloseIcon strokeWidth={4} />,
  CloseAriaLabel = "Close module",
  onCloseClick,

  // Setting btn
  showSettingBtn = false,
  settingBtn = <SettingIcon strokeWidth={2} />,
  settingAriaLabel = "Open Settings",
  onSettingClick,
}) => {
  const buttonPosition = render === "right" ? "right-4" : "left-4";

  return (
    <div className={`relative py-5 ${className}`}>
      {/* close btn */}
      {showCloseBtn && (
        <Button
          variant="icon"
          className={`absolute ${buttonPosition} top-4 border-0 text-primary`}
          aria-label={CloseAriaLabel}
          onClick={onCloseClick}
        >
          {closeBtn}
        </Button>
      )}

      {/* Setting btn */}
      {showSettingBtn && (
        <Button
          variant="icon"
          className={`absolute ${buttonPosition} top-4 border-0 text-primary`}
          aria-label={settingAriaLabel}
          onClick={onSettingClick}
        >
          {settingBtn}
        </Button>
      )}

      <h1 className="text-center text-xl uppercase">{title}</h1>
    </div>
  );
};

export default ModalHeader;
