import React, { useState, useEffect } from 'react';
import styles from './Onboarding.module.css';
import { config } from '../../utils/config';

const onboardingImage = `${config.STATIC_URL}/Picsart_24-08-02_12-42-06-478.jpg`;

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
          setTimeout(onComplete, 500);
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
        <img 
          src={onboardingImage}
          alt="LastRunMan" 
          className={styles.backgroundImage}
        />
        <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;