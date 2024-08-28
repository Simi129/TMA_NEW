import React, { useState, useEffect } from 'react';
import styles from './Onboarding.module.css';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Небольшая задержка перед переходом
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, [onComplete]);

  return (
    <div className={styles.onboarding}>
      <div className={styles.content}>
        <img 
          src="/path-to-your-image.png" 
          alt="LastRunMan" 
          className={styles.image}
        />
        <h1 className={styles.title}>LastRunMan</h1>
        <p className={styles.description}>
          Беги, улучшайся и соревнуйся в этой увлекательной игре с кликером!
        </p>
      </div>
      <div className={styles.loadingContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className={styles.loadingText}>Загрузка: {Math.round(progress)}%</p>
      </div>
    </div>
  );
};

export default Onboarding;