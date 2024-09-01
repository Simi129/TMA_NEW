import React, { useState, useEffect } from 'react';
import { Button, TextField, Snackbar, CircularProgress } from '@mui/material';
import './FriendsScreen.css';
import '../../../types';

interface Friend {
  id: number;
  name: string;
  status: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setDebugInfo('Initializing data...');
      try {
        const tg = window.Telegram?.WebApp;
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
          setInitData({ user: { id: tg.initDataUnsafe.user.id } });
          setDebugInfo(prev => `${prev}\nTelegram user data found: ${JSON.stringify(tg.initDataUnsafe.user)}`);
        } else {
          const randomId = Math.floor(Math.random() * 1000000) + 1;
          setInitData({ user: { id: randomId } });
          setDebugInfo(prev => `${prev}\nRandom user ID generated: ${randomId}`);
        }

        await loadFriends();
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setError('Failed to load data. Please try again later.');
        setDebugInfo(prev => `${prev}\nError during initialization: ${JSON.stringify(error)}`);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const loadFriends = async () => {
    setDebugInfo(prev => `${prev}\nLoading friends...`);
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockFriends = [
        { id: 1, name: "Иван", status: "Присоединился" },
        { id: 2, name: "Мария", status: "Ожидает" },
        { id: 3, name: "Алексей", status: "Присоединился" },
      ];
      setFriends(mockFriends);
      setDebugInfo(prev => `${prev}\nFriends loaded: ${JSON.stringify(mockFriends)}`);
    } catch (error) {
      console.error('Failed to load friends:', error);
      setError('Failed to load friends. Please try again later.');
      setDebugInfo(prev => `${prev}\nError loading friends: ${JSON.stringify(error)}`);
    }
  };

  const generateReferralLink = () => {
    setDebugInfo(prev => `${prev}\nGenerating referral link...`);
    if (initData && initData.user) {
      const userId = initData.user.id;
      const referralCode = btoa(userId.toString());
      const botUsername = 'lastrunman_bot';
      const link = `https://t.me/${botUsername}?start=${referralCode}`;
      setReferralLink(link);
      setDebugInfo(prev => `${prev}\nReferral link generated: ${link}`);
    } else {
      console.error('User data is not available');
      setError('Unable to generate referral link. Please try again later.');
      setDebugInfo(prev => `${prev}\nError: User data not available for referral link generation`);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setShowSnackbar(true);
        setDebugInfo(prev => `${prev}\nReferral link copied to clipboard`);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setError('Failed to copy link. Please try again.');
        setDebugInfo(prev => `${prev}\nError copying referral link: ${JSON.stringify(err)}`);
      });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="friends-screen">
      {error && <div className="error-message">{error}</div>}
      
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
        <h2>Ваши рефералы</h2>
        {friends.length > 0 ? (
          friends.map(friend => (
            <div key={friend.id} className="friend-item">
              <div className="friend-avatar">{friend.name[0]}</div>
              <div className="friend-info">
                <div className="friend-name">{friend.name}</div>
                <div className="friend-status">{friend.status}</div>
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

      <div className="debug-info">
        <h3>Debug Info:</h3>
        <pre>{debugInfo}</pre>
      </div>
    </div>
  );
};

export default FriendsScreen;