import React, { useState } from 'react';
import { upgradesData } from '../../../data/upgradesData';
import './UpgradesScreen.css';

// Определим тип для категорий
type UpgradeCategory = keyof typeof upgradesData;

const UpgradesScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<UpgradeCategory>('personal');

  const handleBuy = (categoryId: UpgradeCategory, upgradeName: string) => {
    // Здесь будет логика покупки улучшения
    console.log(`Buying ${upgradeName} from ${categoryId}`);
  };

  return (
    <div className="upgrades-screen">
      <div className="category-tabs">
        {(Object.keys(upgradesData) as UpgradeCategory[]).map((categoryId) => (
          <button
            key={categoryId}
            className={`category-tab ${selectedCategory === categoryId ? 'active' : ''}`}
            onClick={() => setSelectedCategory(categoryId)}
          >
            {categoryId}
          </button>
        ))}
      </div>

      <div className="upgrades-list">
        {upgradesData[selectedCategory].upgrades.map((upgrade) => (
          <div key={upgrade.name} className="upgrade-item">
            <div className="upgrade-info">
              <span className="upgrade-name">{upgrade.name}</span>
              <span className="upgrade-level">Level: {upgrade.level}/{upgrade.maxLevel}</span>
            </div>
            <div className="upgrade-stats">
              <span className="upgrade-cost">Cost: {upgrade.baseCost}</span>
              <span className="upgrade-income">Income: {upgrade.baseIncome}</span>
            </div>
            <button
              className="buy-button"
              onClick={() => handleBuy(selectedCategory, upgrade.name)}
              disabled={upgrade.level >= upgrade.maxLevel}
            >
              {upgrade.level >= upgrade.maxLevel ? 'Max Level' : 'Buy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradesScreen;