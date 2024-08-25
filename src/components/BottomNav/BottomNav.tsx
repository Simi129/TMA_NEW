import React from 'react';
import { Link } from 'react-router-dom';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/upgrades" className="bottom-nav__item">
        <span className="bottom-nav__icon">🏆</span>
        <span>Upgrades</span>
      </Link>
      <Link to="/stadium" className="bottom-nav__item">
        <span className="bottom-nav__icon">⚽</span>
        <span>Stadium</span>
      </Link>
      <Link to="/" className="bottom-nav__item">
        <span className="bottom-nav__icon">🏠</span>
        <span>Home</span>
      </Link>
      <Link to="/friends" className="bottom-nav__item">
        <span className="bottom-nav__icon">👥</span>
        <span>Friends</span>
      </Link>
      <Link to="/quests" className="bottom-nav__item">
        <span className="bottom-nav__icon">📋</span>
        <span>Quests</span>
      </Link>
    </nav>
  );
};

export default BottomNav;