import React from 'react';
import { useLevel } from '../../contexts/LevelContext';
import { useCoins } from '../../contexts/CoinContext';
import styles from './TopBar.module.css';

const TopBar: React.FC = () => {
  const { level, getLevelProgress } = useLevel();
  const { totalCoins } = useCoins();

  const getCoinsPerHour = (level: number): number => {
    const baseCoinsPerHour = 10;
    return baseCoinsPerHour + (level - 1) * 5;
  };

  const coinsPerHour = getCoinsPerHour(level);
  const progress = getLevelProgress();

  return (
    <div className={styles.topBar}>
      <div className={styles.infoContainer}>
        <span className={styles.level}>Level: {level}</span>
        <div className={styles.progressBar}>
          <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
        </div>
        <span className={styles.coinsPerHour}>{coinsPerHour}/hr</span>
        <span className={styles.totalCoins}>{totalCoins} coins</span>
      </div>
    </div>
  );
};

export default TopBar;