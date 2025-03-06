// src/service/pattern.service.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

export interface Pattern {
  id?: string;
  name: string;
  image?: string;
  sizes: string[];
  category: string[];
  source: string[];
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

export const createNewPattern = async (patternData: Pattern): Promise<void> => {
  try {
    await API.post(`api/patterns`, patternData);
  } catch (error) {
    console.error("Error creating the pattern: ", error);
  }
};

export const updatePattern = async (patternData: Pattern): Promise<void> => {
  try {
    await API.put(`api/patterns/${patternData.id}`, patternData);
  } catch (error) {
    console.error("Error updating the pattern: ", error);
  }
};

export default {
  getAllPatterns,
  createNewPattern,
  updatePattern,
};
