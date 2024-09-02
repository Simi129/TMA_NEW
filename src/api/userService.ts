import axiosInstance from "../axiosInstance";
import axios from 'axios';

export interface User {
  id: number;
  telegramId: number;
  username: string;
}

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    try {
      console.log('Fetching current user...');
      const tg = window.Telegram?.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        console.log('Using Telegram WebApp data');
        const telegramUser = tg.initDataUnsafe.user;
        return {
          id: telegramUser.id,
          telegramId: telegramUser.id,
          username: telegramUser.username || telegramUser.first_name || `User${telegramUser.id}`
        };
      }

      console.log('Fetching user data from server');
      const response = await axiosInstance.get<User>("/auth/me");
      console.log('Server response for current user:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      throw new Error('Failed to get current user data');
    }
  },

  getReferrals: async (): Promise<User[]> => {
    try {
      console.log('Fetching referrals...');
      const response = await axiosInstance.get<User[]>("/user/referrals");
      console.log('Raw API response for referrals:', response);
      
      if (Array.isArray(response.data)) {
        console.log('Referrals data:', response.data);
        return response.data;
      } else {
        console.error('Invalid referrals data structure from API:', response.data);
        throw new Error('Invalid referrals data structure from API');
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      throw new Error('Failed to fetch referrals');
    }
  },
};