import React, { useState } from "react";
import { validateFile, VALID_IMAGE_TYPES } from "../../utils/fileUploadUtils";
import Button from "../ui/Button";
import PenIcon from "../../assets/icons/PenIcon";

const ImageUploader = ({
  initialImageUrl = "",
  onImageUploaded,
  onError,
  label = "Choose Image",
  className = "",
  imageClassName = "w-32 h-32",
  placeholder = "/src/assets/images/profilePlaceholder.jpg",
  displayImagePreview = true,
  userId = null,
}) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || placeholder);
  const [isEditing, setIsEditing] = useState(!initialImageUrl);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef(null);

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

    try {
      // Show preview immediately while uploading
      const localPreview = URL.createObjectURL(file);
      setImageUrl(localPreview);

      // Get the FileUpload context via import to avoid hook rules issues
      const { uploadFile } = window.__fileUploadContext || {};

      if (!uploadFile) {
        throw new Error(
          "File upload service not available. Make sure FileUploadProvider is in your component tree."
        );
      }

      // Upload to blob storage
      const fileType = userId ? "profile-picture" : "image";
      console.log(`Uploading ${fileType} for user ${userId || "unknown"}`);

      const result = await uploadFile(file, fileType, userId);

      if (!result.success) {
        throw new Error(result.error || "Failed to upload image");
      }

      // Call the completion handler with the blob data
      if (onImageUploaded) {
        onImageUploaded({
          url: result.url,
          blobName: result.blobName,
          fileName: file.name,
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
      {isEditing || !displayImagePreview ? (
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

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={VALID_IMAGE_TYPES.join(",")}
            className="hidden"
          />

          {initialImageUrl && displayImagePreview && (
            <Button
              type="secondary"
              className="w-full"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          <div
            className={`overflow-hidden rounded-full border-2 border-light ${imageClassName}`}
          >
            <img
              src={imageUrl}
              alt="Uploaded image"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <Button
            type="icon"
            variant="icon"
            className="absolute bottom-0 right-0 bg-white rounded-full shadow-md border border-light p-1"
            onClick={() => setIsEditing(true)}
            aria-label="Edit image"
          >
            <PenIcon className="w-5 h-5 text-primary" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
