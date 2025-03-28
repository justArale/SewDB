// src/service/pattern.service.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

export interface Pattern {
  id?: string;
  name: string;
  image?: string[];
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

export const getOnePattern = async (patternId: string): Promise<Pattern> => {
  try {
    const response = await API.get(`api/patterns/${patternId}`);
    return response.data.patterns;
  } catch (error) {
    console.error("Error fetching the pattern: ", error);
    return {
      id: "",
      name: "",
      image: [],
      sizes: [],
      category: [],
      source: [],
      intendedFor: "",
    };
  }
};

export const filterPatternsByParameter = async (
  primaryParam: string,
  primaryValue: string,
  secondaryParam?: string,
  secondaryValue?: string
): Promise<Pattern[]> => {
  console.log("Primary param:", primaryParam, "Primary value:", primaryValue);
  try {
    const url = `api/patterns/${primaryParam}/${primaryValue}/${
      secondaryParam || ""
    }/${secondaryValue || ""}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching patterns: ", error);
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

export const deletePattern = async (patternId: string): Promise<void> => {
  try {
    await API.delete(`api/patterns/${patternId}`);
  } catch (error) {
    console.error("Error deleting the patter: ", error);
  }
};

export const likeUnlikePattern = async (
  patternId: string,
  userId: string
): Promise<Pattern | null> => {
  try {
    const response = await API.post(`/api/likes/${patternId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error with liking/unliking pattern: ", error);
    return null;
  }
};

export const getUserLikedPattern = async (
  userId: string
): Promise<Pattern[] | []> => {
  try {
    const response = await API.get(`/api/likes/${userId}/patterns`);
    if (response.data.message) {
      return [];
    }
    return response.data;
  } catch (error: any) {
    console.error("Error with getting all user liked patterns: ", error);
    return [];
  }
};

export default {
  getAllPatterns,
  getOnePattern,
  filterPatternsByParameter,
  createNewPattern,
  updatePattern,
  deletePattern,
  likeUnlikePattern,
  getUserLikedPattern,
};
