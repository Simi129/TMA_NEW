import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LevelContextType {
  level: number;
  experience: number;
  setLevel: (level: number) => void;
  addExperience: (exp: number) => void;
  getLevelProgress: () => number;
  experienceToNextLevel: number;
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

const LEVEL_THRESHOLDS = [0, 1000, 10000, 50000, 150000];

export const LevelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);

  const addExperience = (exp: number) => {
    const newExperience = experience + exp;
    setExperience(newExperience);
    
    while (level < LEVEL_THRESHOLDS.length && newExperience >= LEVEL_THRESHOLDS[level]) {
      setLevel(level + 1);
    }
  };

  const getLevelProgress = () => {
    const currentLevelExp = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextLevelExp = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    return ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  };

  const experienceToNextLevel = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  return (
    <LevelContext.Provider value={{ level, experience, setLevel, addExperience, getLevelProgress, experienceToNextLevel }}>
      {children}
    </LevelContext.Provider>
  );
};

export const useLevel = () => {
  const context = useContext(LevelContext);
  if (context === undefined) {
    throw new Error('useLevel must be used within a LevelProvider');
  }
  return context;
};