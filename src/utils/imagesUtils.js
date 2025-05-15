import { validateFile, VALID_IMAGE_TYPES } from "./fileUploadUtils";

// triggering file input
export function triggerFileUpload(fileInputRef) {
  if (fileInputRef?.current) {
    fileInputRef.current.click();
  }
}

// handleImageUpload with Blob storage version
export async function handleImageUpload(
  event,
  setProfileImage,
  onUploadComplete = null
) {
  const file = event.target.files[0];
  if (!file) return;

  // First validate the file
  const validation = validateFile(file, VALID_IMAGE_TYPES);
  if (!validation.valid) {
    console.error("File validation failed:", validation.error);
    return;
  }

  try {
    // Show a loading state or use a local preview while uploading
    const localPreview = URL.createObjectURL(file);
    setProfileImage(localPreview);

    // Get the FileUpload context via import to avoid hook rules issues
    const { uploadFile } = window.__fileUploadContext || {};

    if (!uploadFile) {
      throw new Error(
        "File upload service not available. Make sure FileUploadProvider is in your component tree."
      );
    }

    // Upload to blob storage
    const result = await uploadFile(file, "image");

    if (!result.success) {
      throw new Error(result.error || "Failed to upload image");
    }

    // Call the completion handler with the blob data
    if (onUploadComplete) {
      onUploadComplete({
        url: result.url,
        blobName: result.blobName,
        fileName: file.name,
        type: file.type,
        size: file.size,
      });
    }

    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    // Reset the image state on error if needed
    // setProfileImage(null);
    return { success: false, error: error.message };
  }
}
