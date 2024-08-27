import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTonConnectUI } from '@tonconnect/ui-react';

const WalletDisplay: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Box>
      {tonConnectUI.account?.address && (
        <Typography variant="body2">
          {shortenAddress(tonConnectUI.account.address)}
        </Typography>
      )}
    </Box>
  );
};

export default WalletDisplay;