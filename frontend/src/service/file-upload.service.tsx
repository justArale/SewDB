// file-upload.service.tsx
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

interface UploadResponse {
  url: string;
}

// Function to upload pattern image
const uploadPatternImage = async (
  fileData: FormData
): Promise<UploadResponse> => {
  try {
    const res = await api.post("/api/upload/image/pattern", fileData);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default {
  uploadPatternImage,
};
