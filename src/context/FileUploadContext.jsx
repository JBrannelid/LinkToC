import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  uploadFileToBlobStorage,
  generateUniqueFilename,
} from "../utils/fileUploadUtils";
import { getUploadSasUrl } from "../api/services/fileService";

const FileUploadContext = createContext();

export const useFileUpload = () => useContext(FileUploadContext);

export const FileUploadProvider = ({ children }) => {
  const [uploads, setUploads] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  // Request SAS URL and upload file
  const uploadFile = useCallback(
    async (file, fileType, container = "images") => {
      try {
        // Generate unique ID for this upload
        const uploadId = `upload_${Date.now()}`;

        // Initialize upload state
        setUploads((prev) => ({
          ...prev,
          [uploadId]: { progress: 0, fileName: file.name, status: "preparing" },
        }));

        // Get SAS URL from API
        const sasUrlResponse = await getUploadSasUrl(fileType, container);

        if (!sasUrlResponse?.sasUrl) {
          throw new Error("Failed to get upload URL");
        }

        // Update status
        setUploads((prev) => ({
          ...prev,
          [uploadId]: { ...prev[uploadId], status: "uploading" },
        }));

        // Upload to blob storage
        const result = await uploadFileToBlobStorage(
          file,
          sasUrlResponse.sasUrl,
          sasUrlResponse.blobName,
          (progress) => {
            setUploads((prev) => ({
              ...prev,
              [uploadId]: { ...prev[uploadId], progress },
            }));
          }
        );

        // Complete upload
        setUploads((prev) => ({
          ...prev,
          [uploadId]: {
            ...prev[uploadId],
            status: "completed",
            progress: 100,
            url: result.url || sasUrlResponse.blobUrl,
            blobName: sasUrlResponse.blobName,
          },
        }));

        return {
          success: true,
          uploadId,
          url: result.url || sasUrlResponse.blobUrl,
          blobName: sasUrlResponse.blobName,
        };
      } catch (error) {
        setUploadErrors((prev) => ({
          ...prev,
          [file.name]: error.message || "Upload failed",
        }));
        return { success: false, error: error.message };
      }
    },
    []
  );

  const clearUpload = useCallback((uploadId) => {
    setUploads((prev) => {
      const newUploads = { ...prev };
      delete newUploads[uploadId];
      return newUploads;
    });
  }, []);

  const clearError = useCallback((fileName) => {
    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fileName];
      return newErrors;
    });
  }, []);

  const value = {
    uploads,
    uploadErrors,
    uploadFile,
    clearUpload,
    clearError,
  };

  // Make the context globally available to solve the hook usage issue
  useEffect(() => {
    window.__fileUploadContext = value;
    return () => {
      delete window.__fileUploadContext;
    };
  }, [value]);

  return (
    <FileUploadContext.Provider value={value}>
      {children}
    </FileUploadContext.Provider>
  );
};
