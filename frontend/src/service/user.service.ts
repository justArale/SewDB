// src/service/user.service.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  authenticateUser: () => void;
  authError: string | null;
  logoutClick: () => void;
}

export interface UserToPattern {
  userId: number;
  patternId: number;
}

export const authenticateUser = async (): Promise<User | null> => {
  try {
    const response = await API.get(`/auth/verify`);
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await API.post(`/auth/logout`);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await API.get(`/api/users`);
    console.log("all users response", response);
    console.log("all users response.data", response.data.users);
    return response.data.users;
  } catch (error) {
    console.error("Error getting all users: ", error);
    return [];
  }
};

export const likeUnlikePattern = async (
  patternId: number,
  userId: number
): Promise<UserToPattern | null> => {
  try {
    const response = await API.post(`/api/likes/${patternId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error with liking/unliking pattern: ", error);
    return null;
  }
};

export const getUserLikedPattern = async (
  userId: number
): Promise<UserToPattern | null> => {
  try {
    const response = await API.get(`api/likes/${userId}/patterns`);
    return response.data;
  } catch (error) {
    console.error("Error with getting all user liked patterns: ", error);
    return null;
  }
};

export const getPatternLikes = async (
  patternId: number
): Promise<UserToPattern | null> => {
  try {
    const response = await API.get(`api/likes/${patternId}/users`);
    return response.data;
  } catch (error) {
    console.error("Error with getting all likes of this pattern: ", error);
    return null;
  }
};

export default {
  authenticateUser,
  logoutUser,
  getAllUsers,
  likeUnlikePattern,
  getUserLikedPattern,
  getPatternLikes,
};
