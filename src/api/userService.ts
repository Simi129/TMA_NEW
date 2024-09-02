import axiosInstance from "../axiosInstance";
import axios from 'axios';

export type User = {
  id: number;
  telegramId: number;
  username: string;
};

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    try {
      console.log('Attempting to get current user...');
      const tg = window.Telegram?.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        console.log('Using Telegram WebApp data');
        const telegramUser = tg.initDataUnsafe.user as TelegramUser;
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
      throw error;
    }
  },

   getReferrals: async (): Promise<User[]> => {
    try {
      console.log('Fetching referrals...');
      const response = await axiosInstance.get("/user/referrals");
      console.log('Raw API response for referrals:', response);
      
      if (response.headers['content-type'].includes('application/json')) {
        if (Array.isArray(response.data)) {
          console.log('Referrals data:', response.data);
          return response.data;
        } else {
          console.error('Invalid referrals data structure from API:', response.data);
          throw new Error('Invalid referrals data structure from API');
        }
      } else {
        console.error('Unexpected content type:', response.headers['content-type']);
        console.error('Response data:', response.data);
        throw new Error(`Unexpected content type: ${response.headers['content-type']}`);
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Axios error details:', {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data
        });
      }
      throw error;
    }
  },
};