import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar, CircularProgress } from '@mui/material';
import './FriendsScreen.css';
import '../../../types';

interface Referral {
  id: number;
  name: string;
  status: string;
}

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        if (!window.Telegram?.WebApp) {
          throw new Error('Telegram WebApp is not available');
        }

        window.Telegram.WebApp.ready();
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (!user) {
          throw new Error('User data is not available');
        }

        await loadReferrals(user.id);
        generateReferralLink(user.id);
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const loadReferrals = async (_userId: number) => {
  try {
    // В будущем здесь будет реальный API-запрос, использующий userId
    // Например: const response = await fetch(`/api/referrals?userId=${userId}`);
    
    // Пока используем моковые данные
    const mockReferrals: Referral[] = [
      { id: 1, name: "Иван", status: "Активный" },
      { id: 2, name: "Мария", status: "Ожидает" },
    ];
    setReferrals(mockReferrals);
  } catch (error) {
    console.error('Failed to load referrals:', error);
    setError('Failed to load referrals. Please try again later.');
  }
};

  const generateReferralLink = (userId: number) => {
    const referralCode = btoa(userId.toString());
    const botUsername = 'lastrunman_bot'; // Замените на username вашего бота
    const link = `https://t.me/${botUsername}?start=${referralCode}`;
    setReferralLink(link);
  };

  const copyReferralLink = () => {
    if (!referralLink) {
      setError('Referral link is not available. Please try again.');
      return;
    }
    navigator.clipboard.writeText(referralLink)
      .then(() => setShowSnackbar(true))
      .catch(err => {
        console.error('Failed to copy:', err);
        setError('Failed to copy link. Please try again.');
      });
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

      <div className="referrals-list">
        <h2>Ваши рефералы</h2>
        {referrals.length > 0 ? (
          referrals.map(referral => (
            <div key={referral.id} className="referral-item">
              <div className="referral-avatar">{referral.name[0]}</div>
              <div className="referral-info">
                <div className="referral-name">{referral.name}</div>
                <div className="referral-status">{referral.status}</div>
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