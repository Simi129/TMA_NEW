import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CoinContextType {
  totalCoins: number;
  addCoins: (amount: number) => void;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const CoinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalCoins, setTotalCoins] = useState(0);

  const addCoins = (amount: number) => {
    setTotalCoins(prevCoins => prevCoins + amount);
  };

  return (
    <CoinContext.Provider value={{ totalCoins, addCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoins = () => {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error('useCoins must be used within a CoinProvider');
  }
  return context;
};