import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { FormProvider, FormInput } from "../forms";
import { useForm } from "react-hook-form";
import ModalHeader from "./ModalHeader";
import FormMessage from "../forms/formBuilder/FormMessage";
import { createSuccessMessage } from "../../utils/errorUtils";
import { useAuth } from "../../context/AuthContext";

const EditInformationModal = ({
  isOpen,
  onClose,
  fieldName,
  fieldLabel,
  initialValue = "",
  userId, // This will be userId or horseId depending on context
  multiline = false,
  userData, // This will be user data or horse data
  refreshUserData,
  isHorse = false,
  isCurrentUser = false,
}) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const methods = useForm({
    defaultValues: {
      [fieldName]: initialValue,
    },
  });

  // Security check - prevent editing if not the current user
  useEffect(() => {
    if (
      isOpen &&
      !isCurrentUser &&
      String(currentUser?.id) !== String(userId)
    ) {
      setMessage({
        type: "error",
        text: "You don't have permission to edit this profile",
      });
      setTimeout(() => onClose(), 2000);
    }
  }, [isOpen, isHorse, currentUser?.id, userId, onClose, isCurrentUser]);

  // Update call directly in handleSubmit sense we handle both user and horse
  // Don't know if this should be placed in a hook or not
  const handleSubmit = async (data) => {
    // Security check - only proceed if it's the current user
    if (!isCurrentUser && String(currentUser?.id) !== String(userId)) {
      setMessage({
        type: "error",
        text: "You don't have permission to edit this profile",
      });
      setTimeout(() => onClose(), 2000);
      return { success: false };
    }

    try {
      setLoading(true);
      setMessage(null);

      let result;

      if (isHorse) {
        try {
          // Import the horse service
          const horseServiceModule = await import(
            "../../api/services/horseService"
          );
          const horseService = horseServiceModule.default;

          const parseNumericValue = (value) => {
            if (!value) return null;

            // Extract only numeric characters
            const numericValue = value.toString().replace(/[^\d]/g, "");
            return numericValue ? parseInt(numericValue, 10) : null;
          };

          const updateData = {
            id: userId,
            name: userData?.name || "",
            breed: userData?.breed || "",
            color: userData?.color || "",
            age: userData?.age || null,
            description: userData?.description || "",
            bio: userData?.bio || "",
            weight: parseNumericValue(userData?.weight),
            height: parseNumericValue(userData?.height),
            currentBox: userData?.currentBox || userData?.stablePlace || "",
          };

          // Handle the field being updated specially
          if (fieldName === "height" || fieldName === "weight") {
            updateData[fieldName] = parseNumericValue(data[fieldName]);
          } else {
            updateData[fieldName] = data[fieldName];
          }

          // Use the correct method from the horse service
          result = await horseService.updateHorse(updateData, userId);
        } catch (importError) {
          throw new Error("Could not update horse: " + importError.message);
        }
      } else {
        // User update code (unchanged)
        const userService = await import("../../api/services/userService").then(
          (m) => m.default
        );

        const updateData = {
          id: userId,
          firstName: userData?.firstName || "",
          lastName: userData?.lastName || "",
          email: userData?.email || "",
          phoneNumber: userData?.phoneNumber || "",
          emergencyContact: userData?.emergencyContact || "",
          coreInformation: userData?.coreInformation || "",
          description: userData?.description || "",
          [fieldName]: data[fieldName],
        };

        result = await userService.update(updateData);
      }

      // Rest of the function remains the same
      if (result.success || result.isSuccess || result.statusCode === 200) {
        setMessage(createSuccessMessage("Information updated successfully"));

        // Call refreshUserData function and handle any errors
        if (typeof refreshUserData === "function") {
          try {
            await refreshUserData();
          } catch (refreshError) {
            console.error("Error during refresh:", refreshError);
          }
        }

        setTimeout(() => {
          onClose();
        }, 2000);

        return { success: true };
      } else {
        throw new Error(result?.message || "Update failed");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update information",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <ModalHeader
          title={`Edit ${fieldLabel}`}
          showCloseBtn={true}
          onCloseClick={onClose}
        />

        <div className="p-4">
          <FormProvider methods={methods} onSubmit={handleSubmit}>
            {multiline ? (
              <FormInput
                name={fieldName}
                type="textarea"
                label={fieldLabel}
                rows={5}
                validation={{
                  required: `${fieldLabel} is required`,
                }}
              />
            ) : (
              <FormInput
                name={fieldName}
                label={fieldLabel}
                validation={{
                  required: `${fieldLabel} is required`,
                }}
              />
            )}

            {message && <FormMessage message={message} className="mt-4" />}

            <div className="flex justify-center mt-6 space-x-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Saving..." : "Save"}
              </Button>

              <Button
                type="secondary"
                onClick={onClose}
                disabled={loading}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default EditInformationModal;
