// src/service/user.service.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

export type User = {
  id?: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
};

export type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  authenticateUser: () => void;
  authError: string | null;
  logoutClick: () => void;
};

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

export const getPatternLikes = async (
  patternId: string
): Promise<User | []> => {
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
  getPatternLikes,
};
