import React from 'react';
import WalletDisplay from '../../WalletDisplay/WalletDisplay';
import { useCoins } from '../../../contexts/CoinContext';
import styles from './HomeScreen.module.css';

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
  const { totalCoins, addCoins } = useCoins();

  const handleImageClick = () => {
    addCoins(1);
    const tg = window.Telegram?.WebApp;
    if (tg && typeof tg.showAlert === 'function') {
      tg.showAlert( '+1' );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.walletDisplay}>
        <WalletDisplay />
      </div>
      <h1 className={styles.title}>Welcome to Telegram Mini App</h1>
      
      <div className={styles.imageContainer}>
        <button onClick={handleImageClick} className={styles.clickableImage}>
          <img src="/tg.png" alt="Click to earn coin" />
        </button>
        <p className={styles.clickText}>Click the image to earn a coin!</p>
      </div>

      <h2 className={styles.sectionTitle}>User Information:</h2>
      {initData.user ? (
        <>
          <p className={styles.infoText}>Name: {initData.user.first_name} {initData.user.last_name}</p>
          <p className={styles.infoText}>Username: {initData.user.username}</p>
          <p className={styles.infoText}>ID: {initData.user.id}</p>
          <p className={styles.infoText}>Language: {initData.user.language_code}</p>
        </>
      ) : (
        <p className={styles.infoText}>No user data available</p>
      )}
      <p className={styles.infoText}>Chat Type: {initData.chat_type}</p>
      <p className={styles.infoText}>Auth Date: {new Date(initData.auth_date * 1000).toLocaleString()}</p>
      
      <h2 className={styles.sectionTitle}>Authentication Status:</h2>
      <p className={styles.infoText}>{authStatus}</p>
      {user && (
        <p className={styles.infoText}>Authenticated as: {JSON.stringify(user)}</p>
      )}

      <h2 className={styles.sectionTitle}>Wallet Information:</h2>
      <p className={styles.infoText}>Total Coins: {totalCoins}</p>
    </div>
  );
};

export default HomeScreen;