import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextField, Snackbar, CircularProgress } from '@mui/material';
import { userService, User, Referral } from '../../../api/userService';
import './FriendsScreen.css';
import '../../../types';

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await userService.getCurrentUser();
      console.log("Received user data:", currentUser); // Для отладки
      setUser(currentUser);
      
      const referralList = await userService.getReferrals();
      console.log("Received referrals:", referralList); // Для отладки
      setReferrals(referralList);
    } catch (error) {
      console.error('Failed to fetch user data or referrals:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const generateReferralLink = useCallback(() => {
    if (user?.telegramId) {
      try {
        const referralCode = btoa(user.telegramId.toString());
        const botUsername = 'lastrunman_bot'; // Замените на username вашего бота
        const link = `https://t.me/${botUsername}?start=${referralCode}`;
        setReferralLink(link);
        console.log("Generated referral link:", link); // Для отладки
      } catch (error) {
        console.error('Error generating referral link:', error);
        setError('Error generating referral link. Please try again.');
      }
    } else {
      console.error('User data or telegramId is not available');
      setError('Unable to generate referral link. User data is missing.');
    }
  }, [user]);

  const copyReferralLink = useCallback(() => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
        .then(() => setShowSnackbar(true))
        .catch(err => {
          console.error('Failed to copy:', err);
          setError('Failed to copy link. Please try again.');
        });
    }
  }, [referralLink]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="friends-screen">
      <Button 
        variant="contained" 
        color="primary" 
        onClick={generateReferralLink}
        disabled={!user}
      >
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
        <h2>Ваши реферальные друзья</h2>
        {referrals.length > 0 ? (
          referrals.map(referral => (
            <div key={referral.id} className="friend-item">
              <div className="friend-avatar">{referral.username[0]}</div>
              <div className="friend-info">
                <div className="friend-name">{referral.username}</div>
                <div className="friend-status">Присоединился: {new Date(referral.joinedAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))
        ) : (
          <p>У вас пока нет реферальных друзей.</p>
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