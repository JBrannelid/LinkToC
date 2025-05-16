import React, { useState } from "react";
import Button from "../ui/Button";
import { FormProvider, FormInput } from "../forms";
import { useForm } from "react-hook-form";
import ModalHeader from "./ModalHeader";
import FormMessage from "../forms/formBuilder/FormMessage";
import { createSuccessMessage } from "../../utils/errorUtils";

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
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const methods = useForm({
    defaultValues: {
      [fieldName]: initialValue,
    },
  });

  // Update call directly in handleSubmit sense we handle both user and horse
  // Don't know if this should be placed in a hook or not
  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage(null);

      let result;

      if (isHorse) {
        // Handle horse update by importing the service directly
        const horseService = await import(
          "../../api/services/horseService"
        ).then((m) => m.default);

        const updateData = {
          id: userId,
          name: userData?.name || "",
          breed: userData?.breed || "",
          color: userData?.color || "",
          age: userData?.age || null,
          description: userData?.description || "",
          bio: userData?.bio || "",
          [fieldName]: data[fieldName],
        };

        console.log("Sending horse update data:", updateData);
        result = await horseService.update(updateData);
      } else {
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

        console.log("Sending user update data:", updateData);
        result = await userService.update(updateData);
      }

      if (result.success || result.isSuccess || result.statusCode === 200) {
        setMessage(createSuccessMessage("Information updated successfully"));

        // Call refreshUserData function and handle any errors
        if (typeof refreshUserData === "function") {
          try {
            await refreshUserData();
            console.log("Data refreshed after update");
          } catch (refreshError) {
            console.error("Error during refresh:", refreshError);
          }
        }

        setTimeout(() => {
          onClose();
        }, 2000); // Close modal after 2 seconds

        return { success: true };
      } else {
        throw new Error(result?.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
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
