// src/service/user.service.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

export interface User {
  id?: string;
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
  userId: string;
  patternId: string;
  name: string;
  id: string;
  image: string;
  sizes: string[];
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
    return response.data.users;
  } catch (error) {
    console.error("Error getting all users: ", error);
    return [];
  }
};

export const getSingleUser = async (userId: string): Promise<User | null> => {
  try {
    const response = await API.get(`/api/users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await API.delete(`/api/users/${userId}`);
  } catch (error) {
    console.error(error);
  }
};

export const likeUnlikePattern = async (
  patternId: string,
  userId: string
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
  userId: string
): Promise<UserToPattern[] | []> => {
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

export const getPatternLikes = async (
  patternId: string
): Promise<UserToPattern | []> => {
  try {
    const response = await API.get(`/api/likes/${patternId}/users`);
    if (response.data.message) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Error with getting all likes of this pattern: ", error);
    return [];
  }
};

export default {
  authenticateUser,
  logoutUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  likeUnlikePattern,
  getUserLikedPattern,
  getPatternLikes,
};
