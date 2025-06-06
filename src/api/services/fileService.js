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
  getReadSasUrl: async (blobName, userId = null) => {
    try {
      // If blobName is just a filename (doesn't contain a slash)
      if (blobName && !blobName.includes("/")) {
        // get userId from parameter first
        let userIdToUse = userId;
        // fallback to localStorage
        if (!userIdToUse) {
          const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}"
          );
          userIdToUse = currentUser?.id;
        }

        if (!userIdToUse) {
          console.warn("Cannot get read URL without user ID");
          throw new Error("User ID is required to get read URL");
        } else {
          blobName = `profile-pictures/${userIdToUse}/${blobName}`;
        }
      }

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
      if (error.response?.status === 404) {
        return {
          success: false,
          error: "File not found",
          notFound: true,
        };
      }

      return {
        success: false,
        error: error.message || "Failed to get read URL",
      };
    }
  },

  // Delete a file from blob storage
  deleteFile: async (blobName, userId = null) => {
    try {
      // If blobName is just a filename (doesn't contain a slash)
      if (!blobName.includes("/")) {
        // Get userId from parameter first
        let userIdToUse = userId;

        if (!userIdToUse) {
          const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}"
          );
          userIdToUse = currentUser?.id;
        }

        if (!userIdToUse) {
          console.warn(
            "Cannot delete file without user ID, attempting direct deletion"
          );
          // Try to delete with just the filename
        } else {
          blobName = `profile-pictures/${userIdToUse}/${blobName}`;
        }
      }

      const response = await axiosInstance.delete(
        `/api/blob-storage/delete-blob?blobName=${encodeURIComponent(blobName)}`
      );

      // Check if the deletion was successful
      if (response && response.isSuccess) {
        return { success: true };
      }

      return {
        success: false,
        error: response?.message || "Failed to delete file",
      };
    } catch (error) {
      console.error("Error deleting file:", error);
      // Don't throw, just return failure
      return { success: false, error: error.message };
    }
  },
};

export const extractFilenameFromBlobPath = (blobPath) => {
  if (!blobPath) return null;
  return blobPath.split("/").pop();
};

export default fileService;

export const { getUploadSasUrl, getReadSasUrl, deleteFile } = fileService;
