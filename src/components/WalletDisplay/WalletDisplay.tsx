import React from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import styles from './WalletDisplay.module.css';

const WalletDisplay: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className={styles.walletDisplay}>
      {tonConnectUI.account?.address && (
        <span className={styles.address}>
          {shortenAddress(tonConnectUI.account.address)}
        </span>
      )}
    </div>
  );
};

export default WalletDisplay;