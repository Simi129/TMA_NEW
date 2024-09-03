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

      // Попытка получить реальные данные из Telegram Web App
      const tg = window.Telegram?.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setInitData({ user: { id: tg.initDataUnsafe.user.id } });
      } else {
        // Если реальные данные недоступны, генерируем случайный ID
        const randomId = Math.floor(Math.random() * 1000000) + 1;
        setInitData({ user: { id: randomId } });
      }

      try {
        await fetchReferrals();
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (initData && initData.user) {
      generateReferralLink();
    }
  }, [initData]);

  const generateReferralLink = () => {
    if (initData && initData.user) {
      const userId = initData.user.id;
      const referralCode = btoa(userId.toString());
      const botUsername = 'lastrunman_bot'; // Замените на username вашего бота
      const link = `https://t.me/${botUsername}?start=${referralCode}`;
      setReferralLink(link);
    } else {
      console.error('User data is not available');
      window.Telegram?.WebApp?.showAlert?.('Unable to generate referral link. Please try again later.');
    }
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
    try {
      console.log('Fetching referrals...');
      const referralsData = await userService.getReferrals();
      console.log('Fetched referrals:', referralsData);
      setReferrals(referralsData);
    } catch (error) {
      console.error('Failed to fetch referrals:', error);
      throw error;
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