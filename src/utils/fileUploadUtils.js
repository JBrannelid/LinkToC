import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

// Map of mime types to file extensions
const mimeToExtension = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

// Max file size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Valid file types
export const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
export const VALID_DOCUMENT_TYPES = ["application/pdf"];

export const validateFile = (
  file,
  allowedTypes = VALID_IMAGE_TYPES,
  maxSize = MAX_FILE_SIZE
) => {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${Math.round(
        maxSize / (1024 * 1024)
      )}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes
        .map((t) => t.split("/")[1])
        .join(", ")}`,
    };
  }

  return { valid: true };
};

export const generateUniqueFilename = (file) => {
  const extension = mimeToExtension[file.type] || "";
  return `${uuidv4()}${extension}`;
};

export const uploadFileToBlobStorage = async (
  file,
  sasUrl,
  blobName,
  progressCallback = () => {}
) => {
  try {
    // Create BlockBlobClient from SAS URL
    const blockBlobClient = new BlockBlobClient(sasUrl);

    // Set up progress tracking
    const totalBytes = file.size;
    let uploadedBytes = 0;

    // Start upload with progress tracking
    await blockBlobClient.uploadData(file, {
      onProgress: (ev) => {
        uploadedBytes = ev.loadedBytes;
        const percentComplete = Math.min(
          Math.round((uploadedBytes / totalBytes) * 100),
          100
        );
        progressCallback(percentComplete);
      },
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    return {
      success: true,
      blobName,
      url: blockBlobClient.url.split("?")[0], // Get the URL without the SAS token
    };
  } catch (error) {
    console.error("Error uploading to blob storage:", error);
    throw error;
  }
};
