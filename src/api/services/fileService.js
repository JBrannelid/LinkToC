import axiosInstance from "../config/axiosConfig";

const fileService = {
  // Get SAS URL for uploading files
  getUploadSasUrl: async (fileType = "image", container = "images") => {
    try {
      const response = await axiosInstance.get(
        `/api/storage/sas-upload-url?fileType=${fileType}&container=${container}`
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

  // Delete a file from blob storage
  deleteFile: async (blobName, container = "images") => {
    try {
      const response = await axiosInstance.delete(
        `/api/storage/delete-blob?blobName=${blobName}&container=${container}`
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

export default fileService;

export const { getUploadSasUrl, deleteFile } = fileService;
