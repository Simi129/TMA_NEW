import axiosInstance from "../axiosInstance";

export interface User {
  id: number;
  telegramId: number;
  username: string;
}

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw new Error('Failed to get current user data');
    }
  },

  getReferrals: async (): Promise<User[]> => {
    try {
      const response = await axiosInstance.get<User[]>("/user/referrals");
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid referrals data format');
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching referrals:", error);
      throw new Error('Failed to fetch referrals');
    }
  },
};