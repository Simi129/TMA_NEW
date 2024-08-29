import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const initUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
        const referralList = await userService.getReferrals();
        setReferrals(referralList);
      } catch (error) {
        console.error('Failed to initialize user or fetch referrals:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, []);

  const generateReferralLink = () => {
    if (user) {
      const referralCode = btoa(user.telegramId.toString());
      const botUsername = 'lastrunman_bot'; // Замените на username вашего бота
      const link = `https://t.me/${botUsername}?start=${referralCode}`;
      setReferralLink(link);
    } else {
      setError('User data is not available');
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setShowSnackbar(true);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setError('Failed to copy link. Please try again.');
      });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="friends-screen">
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