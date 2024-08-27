import React, { useState, useRef } from 'react';
import WalletDisplay from '../../WalletDisplay/WalletDisplay';
import { useCoins } from '../../../contexts/CoinContext';
import { useLevel } from '../../../contexts/LevelContext';
import styles from './HomeScreen.module.css';
import { config } from '../../../utils/config';

const coachImage = `${config.STATIC_URL}/tg.png`;

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  value: string;
}

const HomeScreen: React.FC = () => {
  const { totalCoins, addCoins } = useCoins();
  const { level } = useLevel();
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  const getCoinsPerClick = (level: number): number => {
    switch(level) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 4;
      case 4: return 5;
      case 5: return 6;
      default: return 6; // для уровней выше 5
    }
  };

  const applyTiltEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      const DEG = 20;
      const tiltX = (offsetY / rect.height) * DEG;
      const tiltY = (offsetX / rect.width) * -DEG;

      imageRef.current.style.setProperty('--tiltX', `${tiltX}deg`);
      imageRef.current.style.setProperty('--tiltY', `${tiltY}deg`);

      setTimeout(() => {
        imageRef.current?.style.setProperty('--tiltX', '0deg');
        imageRef.current?.style.setProperty('--tiltY', '0deg');
      }, 300);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const coinsToAdd = getCoinsPerClick(level);
    addCoins(coinsToAdd);

    applyTiltEffect(event);

    const newEffect: ClickEffect = {
      id: Date.now(),
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
      value: `+${coinsToAdd}`
    };
    setClickEffects(prev => [...prev, newEffect]);

    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);

    const tg = window.Telegram?.WebApp;
    if (tg && typeof tg.showAlert === 'function') {
      tg.showAlert(`+${coinsToAdd} монет`);
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
        <button onClick={handleClick} className={styles.clickableImage}>
          <img ref={imageRef} src={coachImage} alt="Click to earn coin" />
          {clickEffects.map(effect => (
            <span
              key={effect.id}
              className={styles.clickEffect}
              style={{
                left: effect.x,
                top: effect.y
              }}
            >
              {effect.value}
            </span>
          ))}
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;