import React from 'react';
import { useLevel } from '../../contexts/LevelContext';
import styles from './TopBar.module.css';

interface TopBarProps {
  progress: number;
  coinsPerHour: number;
}

const TopBar: React.FC<TopBarProps> = ({ progress, coinsPerHour }) => {
  const { level } = useLevel();

  return (
    <div className={styles.topBar}>
      <div className={styles.levelInfo}>Level: {level}</div>
      <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
      <div className={styles.coinsInfo}>Coins/hr: {coinsPerHour}</div>
    </div>
  );
};

export default TopBar;