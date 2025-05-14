import React, { useState } from "react";
import FileUploader from "./FileUploader";
import { VALID_IMAGE_TYPES } from "../../utils/fileUploadUtils";
import Button from "../ui/Button";
import PenIcon from "../../assets/icons/PenIcon";

const ImageUploader = ({
  initialImageUrl = "",
  onImageUploaded,
  label = "Choose Image",
  className = "",
  imageClassName = "w-32 h-32",
  placeholder = "/src/assets/images/profilePlaceholder.jpg",
}) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || placeholder);
  const [isEditing, setIsEditing] = useState(!initialImageUrl);

  const handleFileUploaded = (fileData) => {
    setImageUrl(fileData.url);
    setIsEditing(false);

    if (onImageUploaded) {
      onImageUploaded(fileData);
    }
  };

  return (
    <div className={`${className}`}>
      {isEditing ? (
        <div className="space-y-3">
          <FileUploader
            onFileUploaded={handleFileUploaded}
            accept={VALID_IMAGE_TYPES}
            label={label}
          />

          {initialImageUrl && (
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
