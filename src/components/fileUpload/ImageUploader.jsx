import React, { useState, useRef } from "react";
import { deleteFile, getReadSasUrl } from "../../api/services/fileService";
import userService from "../../api/services/userService";
import { validateFile, VALID_IMAGE_TYPES } from "../../utils/fileUploadUtils";
import Button from "../ui/Button";

const ImageUploader = ({
  initialImageUrl = "",
  onImageUploaded,
  onError,
  label = "Choose Image",
  className = "",
  placeholder = "/images/profilePlaceholder.jpg",
  userId = null,
}) => {
  const [_imageUrl, setImageUrl] = useState(initialImageUrl || placeholder);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, VALID_IMAGE_TYPES);
    if (!validation.valid) {
      if (validation.error.includes("too large")) {
        onError?.("File too large");
      } else {
        onError?.("Invalid file");
      }
      return;
    }

    onError?.("");
    setLoading(true);
    setUploadSuccess(false);

    try {
      // Store current profile picture for later deletion
      let oldProfilePicture = null;
      if (userId) {
        try {
          const userResponse = await userService.getById(userId);
          if (userResponse?.value?.profilePicture) {
            oldProfilePicture = userResponse.value.profilePicture;
          }
        } catch (error) {
          console.warn("Couldn't retrieve old profile picture:", e);
        }
      }

      // Get the FileUpload context via import to avoid hook rules issues
      const { uploadFile } = window.__fileUploadContext || {};

      if (!uploadFile) {
        throw new Error(
          "File upload service not available. Make sure FileUploadProvider is in your component tree."
        );
      }

      // Upload to blob storage
      const fileType = userId ? "profile-picture" : "image";
      const result = await uploadFile(file, fileType, userId);

      if (!result.success) {
        throw new Error(result.error || "Failed to upload image");
      }

      // Extract filename from blobName
      const filename = result.blobName.split("/").pop();

      // Immediately update user profile with new image
      if (userId) {
        const updateResult = await userService.setProfilePicture(
          userId,
          filename
        );

        if (!updateResult || !updateResult.isSuccess) {
          throw new Error("Failed to update profile picture");
        }

        // Delete old profile picture if it exists and is different
        if (oldProfilePicture && oldProfilePicture !== filename) {
          try {
            const deleteResult = await deleteFile(oldProfilePicture, userId);
            if (deleteResult.success) {
              // Delete old image from blob storage
            } else {
              console.warn(
                "Failed to delete old profile picture:",
                deleteResult.error
              );
            }
          } catch (deleteError) {
            console.warn(
              "Error attempting to delete old profile picture:",
              deleteError
            );
            // Continue anyway
          }
        }

        // Show success message
        setUploadSuccess(true);

        // Try to get a proper URL for viewing the image
        try {
          const blobPath = `profile-pictures/${userId}/${filename}`;
          const sasUrl = await getReadSasUrl(blobPath);
          if (sasUrl) {
            setImageUrl(`${sasUrl}&t=${Date.now()}`);
          } else {
            // If SAS URL fails, use placeholder
            setImageUrl(placeholder);
          }
        } catch (sasError) {
          console.warn("Could not get SAS URL for image preview:", sasError);
          setImageUrl(placeholder);
        }
      }

      // Wait a short time to ensure the backend has processed everything
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Call the completion handler with the blob data
      if (onImageUploaded) {
        onImageUploaded({
          url: result.url,
          blobName: result.blobName,
          fileName: filename,
          type: file.type,
          size: file.size,
        });
      }
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      onError?.(error.message || "Failed to upload image");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${className}`}>
      {/* {isEditing || !displayImagePreview ? ( */}
      <div className="space-y-3">
        <Button
          type="secondary"
          onClick={handleClick}
          disabled={loading}
          loading={loading}
          className="text-sm"
        >
          {loading ? "Uploading..." : label}
        </Button>

        {uploadSuccess && (
          <div className="text-green-600 text-sm font-medium">
            Image updated successfully!
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={VALID_IMAGE_TYPES.join(",")}
          className="hidden"
        />
      </div>
      <div className="relative"></div>
    </div>
  );
};

export default ImageUploader;
