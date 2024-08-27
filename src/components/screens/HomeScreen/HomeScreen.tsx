import React from 'react';
import WalletDisplay from '../../WalletDisplay/WalletDisplay';
import { useCoins } from '../../../contexts/CoinContext';
import styles from './HomeScreen.module.css';
import { config } from '../../../utils/config';

const coachImage = `${config.STATIC_URL}/tg.png`;

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
      <div className={styles.topBar}>
        <div className={styles.balanceContainer}>
          <p className={styles.balanceText}>Ваш баланс: {totalCoins}</p>
        </div>
        <div className={styles.walletContainer}>
          <WalletDisplay />
        </div>
      </div>
      
      <div className={styles.imageContainer}>
        <button onClick={handleImageClick} className={styles.clickableImage}>
          <img src={coachImage} alt="Click to earn coin" />
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;