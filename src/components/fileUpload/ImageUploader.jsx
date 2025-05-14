import React, { useState } from "react";
import { useFileUpload } from "../../context/FileUploadContext";
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
}) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || placeholder);
  const [isEditing, setIsEditing] = useState(!initialImageUrl);
  const [loading, setLoading] = useState(false);
  const { uploadFile } = useFileUpload();
  const fileInputRef = React.useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  //  error messages
  const getUserFriendlyErrorMessage = (error) => {
    if (typeof error === "string") {
      if (error.includes("404") || error.includes("NOT_FOUND")) {
        return "Service unavailable";
      }
      if (error.includes("NETWORK")) {
        return "Check connection";
      }
    }
    return "Upload failed";
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, VALID_IMAGE_TYPES);
    if (!validation.valid) {
      if (validation.error.includes("too large")) {
        onError?.("File too large");
      } else {
        onError?.("Invalid file");
      }
      return;
    }

    onError?.(""); // Clear error
    setLoading(true);

    try {
      // Show preview immediately while uploading
      const localPreview = URL.createObjectURL(file);
      setImageUrl(localPreview);

      const result = await uploadFile(file, "image");

      if (result.success) {
        // Set the actual URL from blob storage
        setImageUrl(result.url);
        setIsEditing(false);

        if (onImageUploaded) {
          onImageUploaded({
            url: result.url,
            blobName: result.blobName,
            fileName: file.name,
            type: file.type,
            size: file.size,
          });
        }
        onError?.(""); // Clear error on success
      } else {
        const errorMsg = getUserFriendlyErrorMessage(result.error);
        onError?.(errorMsg);
        // Revert to previous image on failure
        setImageUrl(initialImageUrl || placeholder);
      }
    } catch (err) {
      console.error("Upload error:", err);
      onError?.(getUserFriendlyErrorMessage(err.message || err));
      // Revert to previous image on failure
      setImageUrl(initialImageUrl || placeholder);
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
