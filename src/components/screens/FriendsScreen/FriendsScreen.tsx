import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar } from '@mui/material';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = () => {
      const tg = window.Telegram?.WebApp;
      console.log('Telegram WebApp object:', tg); // Для отладки

      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        console.log('User data from Telegram:', tg.initDataUnsafe.user); // Для отладки
        setInitData({ user: { id: tg.initDataUnsafe.user.id } });
      } else {
        console.warn('Telegram user data not available, using random ID');
        const randomId = Math.floor(Math.random() * 1000000) + 1;
        setInitData({ user: { id: randomId } });
      }
    };

    initializeData();

    // Имитация загрузки списка друзей
    setFriends([
      { id: 1, name: "Иван", status: "Присоединился" },
      { id: 2, name: "Мария", status: "Ожидает" },
      { id: 3, name: "Алексей", status: "Присоединился" },
    ]);
  }, []);

  const generateReferralLink = () => {
    console.log('Generating referral link. Init data:', initData); // Для отладки
    if (initData?.user?.id) {
      const userId = initData.user.id;
      const referralCode = btoa(userId.toString());
      const botUsername = 'lastrunman_bot';
      const link = `https://t.me/${botUsername}?start=${referralCode}`;
      setReferralLink(link);
      console.log('Generated referral link:', link); // Для отладки
    } else {
      const errorMessage = 'User data is not available';
      console.error(errorMessage);
      setError(errorMessage);
      window.Telegram?.WebApp?.showAlert?.(errorMessage);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => setShowSnackbar(true))
      .catch(err => {
        console.error('Failed to copy:', err);
        window.Telegram?.WebApp?.showAlert?.('Failed to copy link. Please try again.');
      });
  };

  return (
    <div className="friends-screen">
      <Button 
        variant="contained" 
        color="primary" 
        onClick={generateReferralLink}
        disabled={!initData?.user?.id}
      >
        Сгенерировать реферальную ссылку
      </Button>

      {error && <div className="error-message">{error}</div>}

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
        <h2>Ваши друзья</h2>
        {friends.map(friend => (
          <div key={friend.id} className="friend-item">
            <div className="friend-avatar">{friend.name[0]}</div>
            <div className="friend-info">
              <div className="friend-name">{friend.name}</div>
              <div className="friend-status">{friend.status}</div>
            </div>
          </div>
        ))}
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