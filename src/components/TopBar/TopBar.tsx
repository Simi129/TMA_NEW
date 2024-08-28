import React from 'react';
import { useLevel } from '../../contexts/LevelContext';
import { useCoins } from '../../contexts/CoinContext';
import styles from './TopBar.module.css';

const TopBar: React.FC = () => {
  const { level } = useLevel();
  const { totalCoins } = useCoins();

  // Примерный расчет монет в час. Этот расчет можно уточнить в зависимости от логики вашей игры
  const getCoinsPerHour = (level: number): number => {
    // Базовое количество монет в час
    const baseCoinsPerHour = 10;
    // Увеличение на 5 монет за каждый уровень
    return baseCoinsPerHour + (level - 1) * 5;
  };

  const coinsPerHour = getCoinsPerHour(level);

  return (
    <div className={styles.topBar}>
      <div className={styles.infoContainer}>
        <span className={styles.level}>Level: {level}</span>
        <span className={styles.coinsPerHour}>{coinsPerHour}/hr</span>
        <span className={styles.totalCoins}>{totalCoins} coins</span>
      </div>
    </div>
  );
};

export default TopBar;