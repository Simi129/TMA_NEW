import React from 'react';
import { useLevel } from '../../contexts/LevelContext';
import { useCoins } from '../../contexts/CoinContext';
import styles from './TopBar.module.css';

const TopBar: React.FC = () => {
  const { level, experience, experienceToNextLevel } = useLevel();
  const { totalCoins } = useCoins();

  const getCoinsPerHour = (level: number): number => {
    const baseCoinsPerHour = 10;
    return baseCoinsPerHour + (level - 1) * 5;
  };

  const coinsPerHour = getCoinsPerHour(level);
  const progress = (experience / experienceToNextLevel) * 100;

  return (
    <div className={styles.topBar}>
      <div className={styles.levelInfo}>
        <span className={styles.level}>Level: {level}</span>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className={styles.coinsInfo}>
        <span className={styles.coinsPerHour}>{coinsPerHour}/hr</span>
        <span className={styles.totalCoins}>{totalCoins} coins</span>
      </div>
    </div>
  );
};

export default TopBar;