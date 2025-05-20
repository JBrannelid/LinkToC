import axiosInstance from "../config/axiosConfig";

const fileService = {
  // Get SAS URL for uploading files
  getUploadSasUrl: async (blobName) => {
    try {
      const response = await axiosInstance.get(
        `/api/blob-storage/get-upload-uri?blobName=${encodeURIComponent(
          blobName
        )}`
      );

      if (response && response.isSuccess) {
        return response.value;
      }

      throw new Error(response?.message || "Failed to get upload URL");
    } catch (error) {
      console.error("Error getting SAS URL:", error);
      throw error;
    }
  },

  // Get URL to read a file
  getReadSasUrl: async (blobName) => {
    try {
      const response = await axiosInstance.get(
        `/api/blob-storage/get-read-uri?blobName=${encodeURIComponent(
          blobName
        )}`
      );

      if (response && response.isSuccess) {
        return response.value;
      }

      throw new Error(response?.message || "Failed to get read URL");
    } catch (error) {
      console.error("Error getting read URL:", error);
      throw error;
    }
  },

  // Delete a file from blob storage
  deleteFile: async (blobName) => {
    try {
      if (!blobName.includes("/")) {
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );
        const userId = currentUser?.id || "1";
        blobName = `profile-pictures/${userId}/${blobName}`;
      }

      const response = await axiosInstance.delete(
        `/api/blob-storage/delete-blob?blobName=${encodeURIComponent(blobName)}`
      );

      if (response && response.isSuccess) {
        return { success: true };
      }

      throw new Error(response?.message || "Failed to delete file");
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },
};

export const extractFilenameFromBlobPath = (blobPath) => {
  if (!blobPath) return null;
  return blobPath.split("/").pop();
};

export default fileService;

export const { getUploadSasUrl, getReadSasUrl, deleteFile } = fileService;
