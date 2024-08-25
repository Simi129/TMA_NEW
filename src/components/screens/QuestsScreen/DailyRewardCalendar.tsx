import React from 'react';
import { Typography, Button } from '@mui/material';
import styles from './DailyRewardCalendar.module.css';

interface DayReward {
  day: number;
  reward: string;
  completed: boolean;
  extraReward?: string;
}

const DailyRewardCalendar: React.FC = () => {
  const rewards: DayReward[] = [
    { day: 1, reward: '1.2M', completed: true },
    { day: 2, reward: '2M', completed: false },
    { day: 3, reward: '2.9M', completed: false },
    { day: 4, reward: '4.1M', completed: false },
    { day: 5, reward: '4.9M', completed: false },
    { day: 6, reward: '5.3M', completed: false, extraReward: '+1' },
    { day: 7, reward: '5.7M', completed: false, extraReward: '+2' },
    { day: 8, reward: '6.6M', completed: false, extraReward: '+3' },
    { day: 9, reward: '7M', completed: false, extraReward: '+4' },
    { day: 10, reward: '7.4M', completed: false, extraReward: '+5' },
    { day: 11, reward: '7.8M', completed: false, extraReward: '+6' },
    { day: 12, reward: '9.9M', completed: false, extraReward: '+7' },
    { day: 13, reward: '10.3M', completed: false, extraReward: '+8' },
    { day: 14, reward: '15M', completed: false, extraReward: '+9' },
    { day: 15, reward: '30M', completed: false, extraReward: '+10' },
    { day: 16, reward: '35M', completed: false, extraReward: '+11' },
  ];

  return (
    <div className={styles.calendarContainer}>
      <Typography variant="h6" className={styles.title}>
        Ежедневная награда
      </Typography>
      <Typography variant="body2" className={styles.nextDay}>
        До следующего дня: 01:23:03
      </Typography>
      <div className={styles.daysGrid}>
        {rewards.map((day) => (
          <div key={day.day} className={`${styles.dayPaper} ${day.completed ? styles.completed : ''}`}>
            <Typography variant="caption" className={styles.dayNumber}>День {day.day}</Typography>
            <Typography variant="body2" className={styles.reward}>
              {day.reward}
            </Typography>
            {day.extraReward && (
              <Typography variant="caption" className={styles.extraReward}>
                {day.extraReward}
              </Typography>
            )}
          </div>
        ))}
      </div>
      <Button variant="contained" className={styles.playButton}>
        ▶ Play
      </Button>
    </div>
  );
};

export default DailyRewardCalendar;