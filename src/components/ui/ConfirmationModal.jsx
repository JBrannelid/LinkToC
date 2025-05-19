import React from "react";
import Button from "../ui/Button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  confirmButtonText = "Yes",
  cancelButtonText = "No",
  confirmButtonType = "danger",
  cancelButtonType = "secondary",
  icon = null,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg w-9/10 p-7 shadow-lg border border-light max-w-md">
        {icon && <div className="flex justify-center mb-4">{icon}</div>}

        <h3 className="text-2xl text-center mb-4">{title}</h3>

        {children && (
          <div className="mb-4 text-center text-gray-600">{children}</div>
        )}

        <Button
          type={confirmButtonType}
          className="w-full mb-3"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmButtonText}
        </Button>

        <Button
          type={cancelButtonType}
          className="w-full border-none"
          onClick={onClose}
          disabled={loading}
        >
          {cancelButtonText}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
