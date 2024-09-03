import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar, CircularProgress } from '@mui/material';
import './FriendsScreen.css';
import { userService, User } from '../../../api/userService';
import '../../../types';

interface InitData {
  user?: {
    id: number;
  };
}

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [referrals, setReferrals] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initData, setInitData] = useState<InitData | null>(null);

  useEffect(() => {
  const initializeData = async () => {
    setLoading(true);
    setError(null);

    try {
      const tg = window.Telegram?.WebApp;
      let userId: number | null = null;

      if (tg) {
        await tg.ready();
      }

      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        userId = tg.initDataUnsafe.user.id;
        console.log("Got user ID from Telegram WebApp:", userId);
      } else {
        try {
          const userData = await userService.getCurrentUser();
          if (userData && userData.telegramId) {
            userId = userData.telegramId;
            console.log("Got user ID from server:", userId);
          } else {
            throw new Error("No telegramId returned from server.");
          }
        } catch (serverError) {
          console.error("Failed to get user data from server:", serverError);
        }
      }

      if (!userId) {
        throw new Error("Failed to obtain user ID from both Telegram and server.");
      }

      const newInitData = { user: { id: userId } };
      setInitData(newInitData);
      generateReferralLink(userId);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to initialize data:', error.message);
      } else {
        console.error('Failed to initialize data:', error);
      }
      setError('Failed to initialize user data. Please reload the page.');
    } finally {
      setLoading(false);
    }
  };

  initializeData();
}, []);

  const generateReferralLink = (userId: number) => {
    const referralCode = btoa(userId.toString());
    const botUsername = 'simi129_bot'; // Замените на username вашего бота
    const link = `https://t.me/${botUsername}?start=${referralCode}`;
    setReferralLink(link);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setShowSnackbar(true);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        window.Telegram?.WebApp?.showAlert?.('Failed to copy link. Please try again.');
      });
  };

  const fetchReferrals = async () => {
    if (!initData || !initData.user) {
      setError('Unable to fetch referrals. User data is missing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching referrals for user ID:', initData.user.id);
      const referralsData = await userService.getReferrals();
      console.log('Fetched referrals:', referralsData);

      if (!Array.isArray(referralsData)) {
        throw new Error('Invalid referrals data format');
      }

      setReferrals(referralsData);
    } catch (error) {
      console.error('Failed to fetch referrals:', error);
      setError('Failed to fetch referrals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="friends-screen">
      {error && <div className="error-message">{error}</div>}

      <div className="referral-link-container">
        <TextField
          fullWidth
          value={referralLink}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          margin="normal"
          placeholder="Реферальная ссылка будет сгенерирована здесь"
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={copyReferralLink}
          disabled={!referralLink}
        >
          Копировать реферальную ссылку
        </Button>
      </div>

      <Button 
        variant="contained" 
        color="secondary" 
        onClick={fetchReferrals}
        style={{ marginTop: '20px' }}
        disabled={!initData || !initData.user}
      >
        Загрузить список рефералов
      </Button>

      <div className="referrals-list">
        <h2>Ваши рефералы</h2>
        {referrals.length > 0 ? (
          referrals.map(referral => (
            <div key={referral.id} className="referral-item">
              <div className="referral-avatar">{referral.username[0]}</div>
              <div className="referral-info">
                <div className="referral-name">{referral.username}</div>
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
