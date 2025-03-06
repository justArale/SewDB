// src/service/pattern.service.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

export interface Pattern {
  id: string;
  name: string;
  image: string;
  sizes: [];
  category: [];
  source: [];
  intendedFor: string;
}

export const getAllPatterns = async (): Promise<Pattern[]> => {
  try {
    const response = await API.get(`api/patterns`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all patterns: ", error);
    return [];
  }
};

export default {
  getAllPatterns,
};
