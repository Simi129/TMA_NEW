import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextField, Snackbar, CircularProgress } from '@mui/material';
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

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const currentUser = await userService.getCurrentUser();
      console.log('Current user:', currentUser);
      setUser(currentUser);
      
      const referralList = await userService.getReferrals();
      console.log('Referrals:', referralList);
      setReferrals(referralList);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const generateReferralLink = useCallback(() => {
    if (user?.telegramId) {
      const referralCode = btoa(user.telegramId.toString());
      const botUsername = 'lastrunman_bot'; // Замените на username вашего бота
      const link = `https://t.me/${botUsername}?start=${referralCode}`;
      setReferralLink(link);
      console.log('Generated referral link:', link);
    } else {
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

  return (
    <div className="friends-screen">
      {error && <div className="error-message">{error}</div>}
      
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