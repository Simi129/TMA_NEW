import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar, CircularProgress } from '@mui/material';
import './FriendsScreen.css';
import '../../../types';

interface InitData {
  user?: {
    id: number;
  };
}

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [initData, setInitData] = useState<InitData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      const tg = window.Telegram?.WebApp;
      console.log('Telegram WebApp object:', tg); // Для отладки

      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        console.log('User data from Telegram:', tg.initDataUnsafe.user); // Для отладки
        setInitData({ user: { id: tg.initDataUnsafe.user.id } });
      } else {
        console.warn('Telegram user data not available, using fallback');
        setInitData({ user: { id: 0 } }); // Fallback ID
      }
      setIsLoading(false);
    };

    initializeData();
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
      const errorMessage = 'Unable to generate referral link. User data is missing.';
      console.error(errorMessage);
      setError(errorMessage);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => setShowSnackbar(true))
      .catch(err => {
        console.error('Failed to copy:', err);
        setError('Failed to copy link. Please try again.');
      });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div className="friends-screen">
      <Button 
        variant="contained" 
        color="primary" 
        onClick={generateReferralLink}
        disabled={!initData?.user?.id}
      >
        Пригласить друга
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