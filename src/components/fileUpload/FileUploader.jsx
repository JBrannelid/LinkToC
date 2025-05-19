import React, { useState, useRef } from "react";
import { useFileUpload } from "../../context/FileUploadContext";
import { validateFile, VALID_IMAGE_TYPES } from "../../utils/fileUploadUtils";
import Button from "../ui/Button";

const FileUploader = ({
  onFileUploaded,
  onError,
  label = "Choose image",
  buttonType = "secondary",
  className = "",
  acceptedTypes = VALID_IMAGE_TYPES,
}) => {
  const fileInputRef = useRef(null);
  const { uploadFile } = useFileUpload();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

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
    const validation = validateFile(file, acceptedTypes);
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
      const result = await uploadFile(file, "image");

      if (result.success) {
        if (onFileUploaded) {
          onFileUploaded({
            url: result.url,
            blobName: result.blobName,
            fileName: file.name,
            type: file.type,
            size: file.size,
          });
          onError?.("");
        }
      } else {
        const errorMsg = getUserFriendlyErrorMessage(result.error);
        onError?.(errorMsg);
      }
    } catch (err) {
      console.error("Upload error:", err);
      onError?.(getUserFriendlyErrorMessage(err.message || err)); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        type={buttonType}
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
        accept={acceptedTypes.join(",")}
        className="hidden"
      />
    </div>
  );
};

export default FileUploader;
