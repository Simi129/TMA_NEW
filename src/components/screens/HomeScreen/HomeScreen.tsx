import React from 'react';
import WalletDisplay from '../../WalletDisplay/WalletDisplay';
import { useCoins } from '../../../contexts/CoinContext';
import styles from './HomeScreen.module.css';


const HomeScreen: React.FC = () => {
  const { totalCoins, addCoins } = useCoins();

  const handleImageClick = () => {
    addCoins(1);
    const tg = window.Telegram?.WebApp;
    if (tg && typeof tg.showAlert === 'function') {
      tg.showAlert('+1 монета');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.walletContainer}>
        <WalletDisplay />
      </div>
      <h1 className={styles.title}>Welcome to Telegram Mini App</h1>
      
      <div className={styles.imageContainer}>
        <button onClick={handleImageClick} className={styles.clickableImage}>
          <img src="/tg.png" alt="Click to earn coin" />
        </button>
        <p className={styles.clickText}>Click the image to earn a coin!</p>
      </div>

      <div className={styles.coinInfo}>
        <p className={styles.coinText}>Total Coins: {totalCoins}</p>
      </div>
    </div>
  );
};

export default HomeScreen;