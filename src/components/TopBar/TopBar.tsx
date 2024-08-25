import React from 'react';
import styles from './TopBar.module.css';
import { useCoins } from '../../contexts/CoinContext';

interface TopBarProps {
  level: number;
  progress: number;
  coinsPerHour: number;
}

const TopBar: React.FC<TopBarProps> = ({ level, progress, coinsPerHour }) => {
  const { totalCoins } = useCoins();

  return (
    <div className={styles.topBar}>
      <div className={styles.content}>
        <div className={styles.infoRow}>
          <span className={styles.level}>Level {level}</span>
          <span className={styles.stats}>Coins/hr: {coinsPerHour}</span>
          <span className={styles.stats}>Total: {totalCoins}</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;