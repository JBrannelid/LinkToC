import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useUserData } from "../../hooks/useUserData";
import ModalHeader from "../layout/ModalHeader";
import Button from "../ui/Button";
import FormInput from "./formBuilder/FormInput";
import FormMessage from "./formBuilder/FormMessage";
import { getErrorMessage, createSuccessMessage } from "../../utils/errorUtils";
import LoadingSpinner from "../ui/LoadingSpinner";
import { formatUserFullName, getProfileImageUrl } from "../../utils/userUtils";
import PasswordChangeForm from "./formBuilder/PasswordChangeForm";
import PenIcon from "../../assets/icons/PenIcon";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";
import ConfirmationModal from "../ui/ConfirmationModal";
import ImageUploader from "../fileUpload/ImageUploader";
import { deleteFile } from "../../api/services/fileService";
import userService from "../../api/services/userService";

const UserProfileForm = ({ onClose, onSuccess, userData: initialUserData }) => {
  const { user, verifyToken } = useAuth();
  const {
    deleteAccount,
    loading: deleteLoading,
    error: deleteError,
  } = useUserData();
  const userId = user?.id;

  // Use our hook for fetching and updating the user
  const {
    userData: fetchedUserData,
    loading,
    loadingState,
    updateUserData,
    fetchAndUpdateUserData,
  } = useUserData(userId);

  // Use either passed userData or fetched userData
  const userData = initialUserData || fetchedUserData || user;
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileImageData, setProfileImageData] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Update form values when user data is available
  useEffect(() => {
    if (userData) {
      methods.reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
      });
    }
  }, [userData, methods]);

  useEffect(() => {
    if (deleteError) {
      setMessage(getErrorMessage(deleteError));
    }
  }, [deleteError]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });

      // Handle profile image if it was changed
      if (profileImageData) {
        try {
          // Step 1: Extract ONLY the filename part from the blob path
          // This is crucial for the backend DTO
          const filename = profileImageData.blobName.split("/").pop();
          console.log("Raw blob path:", profileImageData.blobName);
          console.log("Extracted filename for backend:", filename);

          // Step 2: Delete old profile picture if it exists
          const oldBlobName = userData?.profilePicture;
          if (oldBlobName) {
            console.log("Deleting old profile image:", oldBlobName);
            try {
              await deleteFile(oldBlobName);
            } catch (error) {
              console.error("Error deleting old profile image:", error);
            }
          }

          // Step 3: Send ONLY the filename to the backend
          console.log(
            `Sending profile picture update to backend: userId=${userId}, blobName=${filename}`
          );
          const result = await userService.setProfilePicture(userId, filename);
          console.log("Profile picture update result:", result);

          if (!result || !result.isSuccess) {
            throw new Error("Failed to update profile picture");
          }

          // Step 4: Explicitly update the local user data
          if (userData) {
            userData.profilePicture = filename;
            userData.profileImage = filename;
            userData.profilePictureUrl = filename;
          }

          console.log(
            "Updated local user data with new profile picture:",
            filename
          );
        } catch (error) {
          console.error("Error updating profile picture:", error);
          setMessage(
            getErrorMessage(error, {
              defaultMessage: "Failed to update profile picture",
            })
          );
          setSubmitting(false);
          return;
        }
      }

      // Regular user data update
      try {
        const updateData = {
          id: userId,
          ...data,
        };
        console.log("Sending profile update:", updateData);

        const result = await updateUserData(updateData);
        console.log("Profile update result:", result);

        if (!result.success) {
          throw new Error(result.error || "Profile update failed");
        }

        // Force complete refresh of user data
        // console.log("Forcing user data refresh...");
        // await fetchAndUpdateUserData();
        await verifyToken();

        setMessage(createSuccessMessage("Profile successfully updated"));

        if (onSuccess) {
          onSuccess();
        }

        // Force page refresh to ensure all components reflect the changes
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("Error updating profile:", error);
        setMessage(
          getErrorMessage(error, {
            defaultMessage: "Could not update profile",
          })
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    const success = await deleteAccount(userId);
    if (!success) {
      setShowDeleteConfirm(false);
    }
    setSubmitting(false);
  };

  // Show loading state while fetching user data
  if (loading && !userData) {
    return (
      <div className="py-2 text-gray flex items-center justify-center">
        <LoadingSpinner size="medium" className="text-gray" />

        <p>{loadingState.getMessage()}</p>
      </div>
    );
  }

  const displayUser = userData || user;
  const userFullName = formatUserFullName(displayUser);

  return (
    <div className="fixed inset-0 z-50 bg-white md:bg-black/40 shadow-md flex flex-col md:items-center md:justify-center">
      <div className="w-full h-full md:max-h-8/10 md:w-xl overflow-y-auto bg-white shadow-md rounded flex flex-col relative">
        <div className="bg-primary-light pb-5">
          <ModalHeader
            showChevronLeftBtn={true}
            onChevronClick={onClose}
            className="bg-primary-light"
          />
          <h1 className="text-center text-xl uppercase mt-5">Edit profile</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-20 md:pb-5">
          <FormProvider {...methods}>
            <div>
              {/* Profile Image */}
              <div className="bg-white rounded-lg p-2 mb-4 flex flex-col border-light border-2 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-light">
                    <img
                      src={previewImageUrl || getProfileImageUrl(displayUser)}
                      alt={`Profile image of ${userFullName}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mr-5">
                    <ImageUploader
                      initialImageUrl={displayUser?.profileImage}
                      onImageUploaded={(fileData) => {
                        setProfileImageData(fileData);
                        // Update image preview
                        setPreviewImageUrl(fileData.url);
                      }}
                      onError={setUploadError}
                      label="Choose image"
                      displayImagePreview={true}
                      userId={userId}
                    />
                  </div>
                </div>

                {uploadError && (
                  <p className="text-sm text-error-500 text-end mr-5">
                    {uploadError}
                  </p>
                )}
              </div>

              {/* Personal Info Section */}
              <div className="bg-white rounded-lg p-4 mb-4 border-primary-light border-1 shadow-md">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-bold">Personal Information</h2>
                  {/* <Button type="icon" aria-label="Edit personal information">
                    <PenIcon className="w-7 h-7 text-primary" />
                  </Button> */}
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {/* Firstname field */}
                      <FormInput
                        label="First name"
                        name="firstName"
                        labelPosition="above"
                        validation={{ required: "First name is required" }}
                      />
                    </div>
                    <div>
                      {/* Lastname field */}
                      <FormInput
                        label="Last name"
                        name="lastName"
                        labelPosition="above"
                        validation={{ required: "Last name is required" }}
                      />
                    </div>
                  </div>
                  {/* Email field */}
                  <div className="space-y-2">
                    <FormInput
                      label="Email"
                      name="email"
                      labelPosition="above"
                      readOnly={true} // Change to false when BE allow us to edit
                      inputClassName="bg-gray-100 cursor-not-allowed" // Remove when BE allow us to edit
                      validation={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Ogiltig email adress",
                        },
                      }}
                    />
                  </div>

                  {/* Phone number field */}
                  <div className="space-y-2">
                    <FormInput
                      label="Phone number"
                      name="phoneNumber"
                      labelPosition="above"
                      readOnly={true} // Change to false when BE allow us to edit
                      inputClassName="bg-gray-100 cursor-not-allowed" // Remove when BE allow us to edit
                      validation={{
                        pattern: {
                          value:
                            /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i,
                          message: "Ogiltigt telefonnummer format",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="bg-white rounded-lg p-4 mb-4 border-primary-light border-1 shadow-md flex flex-col">
                <div className="flex justify-between items-center w-full">
                  <h2 className="font-bold">Update password</h2>
                  {!showPasswordForm && (
                    <Button
                      type="icon"
                      aria-label="Update password fields"
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                      <PenIcon className="w-7 h-7 text-primary" />
                    </Button>
                  )}
                </div>

                {showPasswordForm && (
                  <PasswordChangeForm
                    onCancel={() => setShowPasswordForm(false)}
                    user={userData || user}
                    onSuccess={() => {
                      setShowPasswordForm(false);
                      setMessage(createSuccessMessage("Lösenord uppdaterat"));
                    }}
                  />
                )}
              </div>

              <FormMessage message={message} />

              {/* Action Buttons */}
              <div className="flex justify-center">
                <div className=" w-9/10 sm:w-8/10">
                  <Button
                    type="primary"
                    onClick={methods.handleSubmit(onSubmit)}
                    loading={submitting}
                    disabled={submitting}
                    className="w-full mb-5"
                  >
                    Save Changes
                  </Button>

                  <Button
                    type="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={submitting}
                    className="w-full"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </FormProvider>
        </div>
        {/* Delete modual */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          loading={submitting}
          title="Do you want to delete the account?"
          icon={
            <HandRaisedIcon
              size={70}
              backgroundColor="bg-error-500"
              iconColor="text-white"
            />
          }
        />
      </div>
    </div>
  );
};
export default UserProfileForm;
