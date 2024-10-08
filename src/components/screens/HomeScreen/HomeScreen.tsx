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
  const imageRef = useRef<HTMLButtonElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const coinsToAdd = getCoinsPerClick(level);
    addCoins(coinsToAdd);

    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const clickX = event.clientX;
      const clickY = event.clientY;

      // Вычисляем расстояние от центра до точки клика
      const distanceX = clickX - centerX;
      const distanceY = clickY - centerY;

      // Нормализуем расстояние для создания эффекта наклона
      const maxDistance = Math.max(rect.width, rect.height) / 2;
      const normalizedX = distanceX / maxDistance;
      const normalizedY = distanceY / maxDistance;

      // Создаем эффект наклона и небольшого движения назад
      const tiltX = normalizedY * 10; // Наклон по оси X (вертикальный наклон)
      const tiltY = -normalizedX * 10; // Наклон по оси Y (горизонтальный наклон)
      const moveX = normalizedX * 10; // Движение по X
      const moveY = normalizedY * 10; // Движение по Y

      if (imageRef.current) {
        imageRef.current.style.transform = `
          translate(${moveX}px, ${moveY}px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          scale(0.95)
        `;
        setTimeout(() => {
          if (imageRef.current) {
            imageRef.current.style.transform = 'translate(0, 0) rotateX(0) rotateY(0) scale(1)';
          }
        }, 300);
      }
    }

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
  };

  const getCoinsPerClick = (level: number): number => {
    switch(level) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 4;
      case 4: return 5;
      case 5: return 6;
      default: return 6;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.balanceContainer}>
          <p className={styles.balanceText}>Ваш баланс: {totalCoins}</p>
        </div>
        <div className={styles.walletContainer}>
          <WalletDisplay />
        </div>
        <div className={styles.imageContainer}>
          <button ref={imageRef} onClick={handleClick} className={styles.clickableImage}>
            <img src={coachImage} alt="Click to earn coin" />
          </button>
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
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;