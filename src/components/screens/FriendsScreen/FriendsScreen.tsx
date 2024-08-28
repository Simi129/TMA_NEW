import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar } from '@mui/material';
import './FriendsScreen.css';
import '../../../types';

interface Friend {
  id: number;
  name: string;
  status: string;
  joinedViaReferral: boolean;
}

interface InitData {
  user?: {
    id: number;
  };
}

const FriendsScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [initData, setInitData] = useState<InitData | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      setInitData({ user: { id: tg.initDataUnsafe.user.id } });
    } else {
      const randomId = Math.floor(Math.random() * 1000000) + 1;
      setInitData({ user: { id: randomId } });
    }

    // Здесь должен быть запрос к API для получения списка друзей
    // Имитация получения данных с сервера
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    // Имитация запроса к API
    const mockApiResponse = [
      { id: 1, name: "Иван", status: "Присоединился", joinedViaReferral: true },
      { id: 2, name: "Мария", status: "Ожидает", joinedViaReferral: false },
      { id: 3, name: "Алексей", status: "Присоединился", joinedViaReferral: true },
      { id: 4, name: "Елена", status: "Присоединился", joinedViaReferral: false },
    ];

    setFriends(mockApiResponse);
  };

  const generateReferralLink = () => {
    if (initData && initData.user) {
      const userId = initData.user.id;
      const referralCode = btoa(userId.toString());
      const botUsername = 'lastrunman_bot';
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
        <h2>Ваши друзья</h2>
        {friends.map(friend => (
          <div key={friend.id} className={`friend-item ${friend.joinedViaReferral ? 'referral-friend' : ''}`}>
            <div className="friend-avatar">{friend.name[0]}</div>
            <div className="friend-info">
              <div className="friend-name">{friend.name}</div>
              <div className="friend-status">{friend.status}</div>
              {friend.joinedViaReferral && <div className="referral-badge">Реферал</div>}
            </div>
          </div>
        ))}
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