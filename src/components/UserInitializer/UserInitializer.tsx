import { useEffect } from 'react';
import axios from 'axios';

export const UserInitializer: React.FC = () => {
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Проверяем наличие объекта Telegram и WebApp
        if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
          const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
          
          if (tgUser) {
            const response = await axios.post('/api/users/initialize', {
              telegramId: tgUser.id.toString(),
              username: tgUser.username || `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`
          });
  
        console.log('User initialized:', response.data);
      }
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    initializeUser();
  }, []);

  return null;
};