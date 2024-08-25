import React from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Avatar, Typography, Box } from '@mui/material';

const WalletDisplay: React.FC = () => {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  if (!address) {
    return null;
  }

  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderRadius: '20px',
        padding: '4px 12px',
        cursor: 'pointer'
      }}
      onClick={() => tonConnectUI.openModal()}
    >
      <Avatar sx={{ width: 24, height: 24, marginRight: 1 }}>W</Avatar>
      <Typography variant="body2">{shortAddress}</Typography>
    </Box>
  );
};

export default WalletDisplay;