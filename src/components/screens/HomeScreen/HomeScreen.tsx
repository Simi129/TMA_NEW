import React from 'react';
import { Typography, Box } from '@mui/material';
import WalletDisplay from '../../WalletDisplay/WalletDisplay';
import { useCoins } from '../../../contexts/CoinContext';

interface HomeScreenProps {
  initData: {
    user?: {
      first_name: string;
      last_name?: string;
      username?: string;
      id: number;
      language_code?: string;
    };
    chat_type?: string;
    auth_date: number;
  };
  authStatus: string;
  user: any; // Замените 'any' на правильный тип пользователя
}

const HomeScreen: React.FC<HomeScreenProps> = ({ initData, authStatus, user }) => {
  const { totalCoins } = useCoins();

  return (
    <Box p={2}>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <WalletDisplay />
      </Box>
      <Typography variant="h4">Welcome to Telegram Mini App</Typography>
      <Typography variant="h5" mt={2}>User Information:</Typography>
      {initData.user ? (
        <>
          <Typography>Name: {initData.user.first_name} {initData.user.last_name}</Typography>
          <Typography>Username: {initData.user.username}</Typography>
          <Typography>ID: {initData.user.id}</Typography>
          <Typography>Language: {initData.user.language_code}</Typography>
        </>
      ) : (
        <Typography>No user data available</Typography>
      )}
      <Typography>Chat Type: {initData.chat_type}</Typography>
      <Typography>Auth Date: {new Date(initData.auth_date * 1000).toLocaleString()}</Typography>
      
      <Typography variant="h5" mt={2}>Authentication Status:</Typography>
      <Typography>{authStatus}</Typography>
      {user && (
        <Typography>Authenticated as: {JSON.stringify(user)}</Typography>
      )}

      <Typography variant="h5" mt={2}>Wallet Information:</Typography>
      <Typography>Total Coins: {totalCoins}</Typography>

      <Box mt={2}>
        <Typography variant="h6">Connected Wallet:</Typography>
        <WalletDisplay />
      </Box>
    </Box>
  );
};

export default HomeScreen;