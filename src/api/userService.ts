import axiosInstance from "../axiosInstance";

export type User = {
  id: number;
  telegramId: number;
  username: string;
};

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },
  // ... другие методы
};