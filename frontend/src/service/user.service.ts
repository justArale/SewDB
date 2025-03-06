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

export default {
  authenticateUser,
  logoutUser,
  getAllUsers,
};
