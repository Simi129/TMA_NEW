import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar, CircularProgress } from '@mui/material';
import './FriendsScreen.css';
import '../../../types';

interface Friend {
  id: number;
  name: string;
  status: string;
}

interface InitData {
  user?: {
    id: number;
  };
}

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [initData, setInitData] = useState<InitData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Попытка получить реальные данные из Telegram Web App
        const tg = window.Telegram?.WebApp;
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
          setInitData({ user: { id: tg.initDataUnsafe.user.id } });
        } else {
          // Если реальные данные недоступны, генерируем случайный ID
          const randomId = Math.floor(Math.random() * 1000000) + 1;
          setInitData({ user: { id: randomId } });
        }

        await loadFriends();
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const loadFriends = async () => {
    try {
      // Здесь должен быть запрос к API для получения списка друзей
      // Пока используем моковые данные
      setFriends([
        { id: 1, name: "Иван", status: "Присоединился" },
        { id: 2, name: "Мария", status: "Ожидает" },
        { id: 3, name: "Алексей", status: "Присоединился" },
      ]);
    } catch (error) {
      console.error('Failed to load friends:', error);
      setError('Failed to load friends. Please try again later.');
    }
  };

  const generateReferralLink = () => {
    if (initData && initData.user) {
      const userId = initData.user.id;
      const referralCode = btoa(userId.toString());
      const botUsername = 'lastrunman_bot'; // Замените на username вашего бота
      const link = `https://t.me/${botUsername}?start=${referralCode}`;
      setReferralLink(link);
    } else {
      console.error('User data is not available');
      setError('Unable to generate referral link. Please try again later.');
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setShowSnackbar(true);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setError('Failed to copy link. Please try again.');
      });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="friends-screen">
      {error && <div className="error-message">{error}</div>}
      
      <Button variant="contained" color="primary" onClick={generateReferralLink}>
        Сгенерировать реферальную ссылку
      </Button>

      {referralLink && (
        <div className="referral-link-container">
          <TextField
            fullWidth
            value={referralLink}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            margin="normal"
          />
          <Button variant="outlined" color="secondary" onClick={copyReferralLink}>
            Копировать ссылку
          </Button>
        </div>
      )}

      <div className="friends-list">
        <h2>Ваши рефералы</h2>
        {friends.length > 0 ? (
          friends.map(friend => (
            <div key={friend.id} className="friend-item">
              <div className="friend-avatar">{friend.name[0]}</div>
              <div className="friend-info">
                <div className="friend-name">{friend.name}</div>
                <div className="friend-status">{friend.status}</div>
              </div>
            </div>
          ))
        ) : (
          <p>У вас пока нет рефералов. Поделитесь своей реферальной ссылкой, чтобы пригласить друзей!</p>
        )}
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
        message="Ссылка скопирована в буфер обмена"
      />
    </div>
  );
};

export default FriendsScreen;