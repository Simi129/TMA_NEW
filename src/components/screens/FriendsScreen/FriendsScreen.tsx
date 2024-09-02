import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar, CircularProgress } from '@mui/material';
import './FriendsScreen.css';
import '../../../types';
import { userService, User } from '../../../api/userService';

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [referrals, setReferrals] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        console.log('Initializing data...');
        let currentUser: User | null = null;
        try {
          currentUser = await userService.getCurrentUser();
          console.log('Current user data:', currentUser);
        } catch (userError) {
          console.error('Error getting current user:', userError);
        }

        if (currentUser && currentUser.telegramId) {
          generateReferralLink(currentUser.telegramId);
        } else {
          console.warn('Unable to generate referral link: No valid user data');
          setError('Unable to generate referral link. Please try again later.');
        }

        await loadReferrals();
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

 const loadReferrals = async () => {
  try {
    console.log('Loading referrals...');
    const referralsData = await userService.getReferrals();
    console.log('Referrals loaded successfully:', referralsData);
    setReferrals(referralsData);
  } catch (error) {
    console.error('Failed to load referrals:', error);
    if (error instanceof Error) {
      setError(`Failed to load referrals: ${error.message}`);
    } else {
      setError('Failed to load referrals. Please try again later.');
    }
  }
};

  const generateReferralLink = (userId: number) => {
    try {
      const referralCode = btoa(userId.toString());
      const botUsername = 'lastrunman_bot'; // Замените на username вашего бота
      const link = `https://t.me/${botUsername}?start=${referralCode}`;
      setReferralLink(link);
      console.log('Generated referral link:', link);
    } catch (error) {
      console.error('Failed to generate referral link:', error);
      setError('Failed to generate referral link. Please try again later.');
    }
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
        {referrals && referrals.length > 0 ? (
          referrals.map(referral => (
            <div key={referral.id} className="referral-item">
              <div className="referral-avatar">{referral.username ? referral.username[0] : '?'}</div>
              <div className="referral-info">
                <div className="referral-name">{referral.username || 'Неизвестный пользователь'}</div>
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