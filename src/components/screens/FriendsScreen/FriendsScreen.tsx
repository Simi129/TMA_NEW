import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar } from '@mui/material';
import { userService, User } from '../../../api/userService';
import './FriendsScreen.css';

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user data...');
        const currentUser = await userService.getCurrentUser();
        console.log('Received user data:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to fetch user data. Please try again later.');
      }
    };

    fetchUser();

    // Альтернативный способ получения данных пользователя
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      console.log('Telegram WebApp user data:', tg.initDataUnsafe.user);
    } else {
      console.log('Telegram WebApp user data not available');
    }
  }, []);

  const generateReferralLink = () => {
    console.log('Generating referral link. User:', user);
    if (user?.telegramId) {
      const referralCode = btoa(user.telegramId.toString());
      const botUsername = 'lastrunman_bot';
      const link = `https://t.me/${botUsername}?start=${referralCode}`;
      setReferralLink(link);
      console.log('Generated referral link:', link);
    } else {
      const errorMessage = 'Unable to generate referral link. User data is missing.';
      console.error(errorMessage);
      setError(errorMessage);
    }
  };

  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
        .then(() => setShowSnackbar(true))
        .catch(err => {
          console.error('Failed to copy:', err);
          setError('Failed to copy link. Please try again.');
        });
    }
  };

  return (
    <div className="friends-screen">
      {error && <div className="error-message">{error}</div>}
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={generateReferralLink}
        disabled={!user}
      >
        Пригласить друга
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

      <div className="friends-screen-debug">
        <h3>Debug Info:</h3>
        <pre>{JSON.stringify({ user, error }, null, 2)}</pre>
      </div>

      <div className="friends-list">
        <h2>Приглашенные друзья</h2>
        <p>Список приглашенных друзей будет отображаться здесь.</p>
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