import React, { useCallback, useState } from "react";
import { useFileUpload } from "../../context/FileUploadContext";
import { useDropzone } from "react-dropzone";
import {
  validateFile,
  VALID_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "../../utils/fileUploadUtils";
import LoadingSpinner from "../ui/LoadingSpinner";
import Button from "../ui/Button";

const FileUploader = ({
  onFileUploaded,
  maxFiles = 1,
  accept = VALID_IMAGE_TYPES,
  maxSize = MAX_FILE_SIZE,
  label = "Upload Image",
  className = "",
  buttonType = "primary",
}) => {
  const { uploadFile, uploadErrors, clearError } = useFileUpload();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Validate files first
      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0]; // Only handle the first file for now
      const validation = validateFile(file, accept, maxSize);

      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      setError("");
      setIsUploading(true);

      try {
        const fileType = file.type.startsWith("image/") ? "image" : "document";
        const result = await uploadFile(file, fileType);

        if (result.success) {
          if (onFileUploaded) {
            onFileUploaded({
              url: result.url,
              blobName: result.blobName,
              fileName: file.name,
              type: file.type,
              size: file.size,
            });
          }
        } else {
          setError(result.error || "Upload failed");
        }
      } catch (err) {
        setError(err.message || "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile, onFileUploaded, accept, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((obj, type) => ({ ...obj, [type]: [] }), {}),
    maxSize,
    maxFiles,
    disabled: isUploading,
  });

  // Format accepted types for display
  const formatAcceptedTypes = () => {
    return accept.map((type) => type.split("/")[1].toUpperCase()).join(", ");
  };

  return (
    <div className={`w-full ${className}`}>
      {error && (
        <div className="bg-red-50 border-l-4 border-error-500 p-3 mb-3 rounded">
          <p className="text-sm text-error-600">{error}</p>
          <button
            className="text-xs text-primary mt-1"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary-light/30"
              : "border-gray/40 hover:border-primary"
          }
          ${isUploading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="py-4 flex flex-col items-center">
            <LoadingSpinner size="medium" className="text-primary mb-2" />
            <p className="text-sm text-gray">Uploading...</p>
          </div>
        ) : (
          <>
            <Button
              type={buttonType}
              className="mb-2 mx-auto"
              disabled={isUploading}
            >
              {label}
            </Button>

            <p className="text-sm text-gray mb-1">
              {isDragActive ? "Drop the file here" : "or drag and drop here"}
            </p>

            <p className="text-xs text-gray">
              Accepted: {formatAcceptedTypes()} (Max{" "}
              {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
