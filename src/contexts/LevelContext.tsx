import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LevelContextType {
  level: number;
  setLevel: (level: number) => void;
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState(1);

  return (
    <LevelContext.Provider value={{ level, setLevel }}>
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