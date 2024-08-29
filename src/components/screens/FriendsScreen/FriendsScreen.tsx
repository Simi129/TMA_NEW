import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar, CircularProgress, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { userService, User, Referral } from '../../../api/userService';
import './FriendsScreen.css';
import '../../../types';

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
        await fetchReferrals();
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  const fetchReferrals = async () => {
    try {
      const referralList = await userService.getReferrals();
      setReferrals(referralList);
    } catch (error) {
      console.error('Failed to fetch referrals:', error);
      setError('Failed to load referrals. Please try again later.');
    }
  };

  const generateReferralLink = () => {
    if (user && user.telegramId) {
      const referralCode = btoa(user.telegramId.toString());
      const botUsername = 'lastrunman_bot'; // Замените на username вашего бота
      const link = `https://t.me/${botUsername}?start=${referralCode}`;
      setReferralLink(link);
    } else {
      setError('Unable to generate referral link. User data is missing.');
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

      <div className="referrals-list">
        <h2>Приглашенные друзья</h2>
        {referrals.length > 0 ? (
          <List>
            {referrals.map((referral) => (
              <ListItem key={referral.id}>
                <ListItemAvatar>
                  <Avatar>{referral.username[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={referral.username} 
                  secondary={`Присоединился: ${new Date(referral.joinedAt).toLocaleDateString()}`} 
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <p>У вас пока нет приглашенных друзей. Поделитесь своей реферальной ссылкой, чтобы пригласить друзей!</p>
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