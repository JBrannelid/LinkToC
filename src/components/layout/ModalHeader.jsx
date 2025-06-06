import React from "react";
import ChevronLeftIcon from "../../assets/icons/ChevronLeftIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import SettingIcon from "../../assets/icons/SettingIcon";
import Button from "../ui/Button";

const ModalHeader = ({
  // Button configuration
  title,
  className = "",
  render = "left", // "left/right
  children,

  // Close btn
  showCloseBtn = false,
  closeBtn = <CloseIcon size={30} strokeWidth={2} />,
  closeAriaLabel = "Close module",
  onCloseClick,

  // chevron btn
  showChevronLeftBtn = false,
  goBackBtn = (
    <ChevronLeftIcon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
  ),
  chevronAriaLabel = "Go back",
  onChevronClick,

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
          aria-label={closeAriaLabel}
          onClick={onCloseClick}
        >
          {closeBtn}
        </Button>
      )}

      {/* ChevronLeft Btn */}
      {showChevronLeftBtn && (
        <Button
          variant="icon"
          className={`absolute ${buttonPosition} top-4 border-0 text-primary`}
          aria-label={chevronAriaLabel}
          onClick={onChevronClick}
        >
          {goBackBtn}
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
      {children}
    </div>
  );
};

export default ModalHeader;
