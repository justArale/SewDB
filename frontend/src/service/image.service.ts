// file-upload.service.tsx
import axios from "axios";
import { extractPublicId } from "cloudinary-build-url";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

type UploadResponse = {
  url: string;
}

// Function to upload pattern image
export const uploadPatternImage = async (
  fileData: FormData
): Promise<UploadResponse> => {
  try {
    const res = await API.post("/api/upload/image/pattern", fileData);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePatternImage = async (imageURL: string): Promise<void> => {
  if (!imageURL) return;

  try {
    const oldPath = extractPublicId(imageURL);
    const segments = oldPath ? oldPath.split("/") : [];
    const imageId = segments.length > 0 ? segments[segments.length - 1] : "";

    if (!imageId) {
      console.error("No valid image ID found.");
      return;
    }

    await API.delete(`/api/delete/image/pattern/${imageId}`);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export default {
  uploadPatternImage,
  deletePatternImage,
};
