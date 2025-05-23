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
import { v4 as uuidv4 } from "uuid";

const FileUploadContext = createContext();

export const useFileUpload = () => useContext(FileUploadContext);

export const FileUploadProvider = ({ children }) => {
  const [uploads, setUploads] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  // Request SAS URL and upload file
  const uploadFile = useCallback(async (file, fileType, userId) => {
    try {
      // Generate unique ID for this upload
      const uploadId = `upload_${Date.now()}`;

      // Initialize upload state
      setUploads((prev) => ({
        ...prev,
        [uploadId]: { progress: 0, fileName: file.name, status: "preparing" },
      }));

      // Generate proper blob name
      let blobName;
      if (fileType === "profile-picture" && userId) {
        // Get file extension from the file name
        const fileExtension = file.name.split(".").pop().toLowerCase();
        // Generate a unique ID for the blob
        const uniqueId = uuidv4();
        // Format according to backend expectation: profile-pictures/{userId}/{uniqueId}.jpg
        blobName = `profile-pictures/${userId}/${uniqueId}.${fileExtension}`;
      } else {
        // Use generic naming for other file types
        blobName = generateUniqueFilename(file);
      }

      // Get SAS URL from API
      const sasUrlResponse = await getUploadSasUrl(blobName);

      if (!sasUrlResponse) {
        throw new Error("Failed to get upload URL");
      }

      // Update status
      setUploads((prev) => ({
        ...prev,
        [uploadId]: { ...prev[uploadId], status: "uploading", blobName },
      }));

      // Upload to blob storage
      const result = await uploadFileToBlobStorage(
        file,
        sasUrlResponse,
        blobName,
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
          url: result.url,
          blobName: blobName,
        },
      }));

      return {
        success: true,
        uploadId,
        url: result.url,
        blobName: blobName,
      };
    } catch (error) {
      console.error("Upload error:", error);
      setUploadErrors((prev) => ({
        ...prev,
        [file.name]: error.message || "Upload failed",
      }));
      return { success: false, error: error.message };
    }
  }, []);

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
    window.__fileUploadContext = {
      ...value,
      uploadFile: (file, fileType, userId) =>
        uploadFile(file, fileType, userId),
    };
    return () => {
      delete window.__fileUploadContext;
    };
  }, [value, uploadFile]);

  return (
    <FileUploadContext.Provider value={value}>
      {children}
    </FileUploadContext.Provider>
  );
};
