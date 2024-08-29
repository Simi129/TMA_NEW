import React, { useState } from 'react';
import { Button, TextField, Snackbar } from '@mui/material';
import './FriendsScreen.css';

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const generateReferralLink = () => {
    const dummyUserId = '12345'; // Заглушка для ID пользователя
    const referralCode = btoa(dummyUserId);
    const botUsername = 'lastrunman_bot';
    const link = `https://t.me/${botUsername}?start=${referralCode}`;
    setReferralLink(link);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => setShowSnackbar(true))
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div className="friends-screen">
      <Button 
        variant="contained" 
        color="primary" 
        onClick={generateReferralLink}
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