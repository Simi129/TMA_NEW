import axiosInstance from "../axiosInstance";

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
      // Попытка получить данные из Telegram WebApp
      const tg = window.Telegram?.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const telegramUser = tg.initDataUnsafe.user as TelegramUser;
        return {
          id: telegramUser.id,
          telegramId: telegramUser.id,
          username: telegramUser.username || telegramUser.first_name || `User${telegramUser.id}`
        };
      }

      // Если данные из Telegram WebApp недоступны, делаем запрос к серверу
      const response = await axiosInstance.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  getReferrals: async (): Promise<User[]> => {
    try {
      const response = await axiosInstance.get<User[]>("/user/referrals");
      return response.data;
    } catch (error) {
      console.error("Error fetching referrals:", error);
      throw error;
    }
  },

  // Можно добавить другие методы здесь, если нужно
};