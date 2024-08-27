import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { CoinProvider } from './contexts/CoinContext';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import { bindViewportCSSVars, initViewport, bindThemeParamsCSSVars, initThemeParams } from "@telegram-apps/sdk";
import TopBar from './components/TopBar/TopBar';
import BottomNav from './components/BottomNav/BottomNav';
import HomeScreen from './components/screens/HomeScreen/HomeScreen';
import UpgradesScreen from './components/screens/UpgradesScreen/UpgradesScreen';
import StadiumScreen from './components/screens/StadiumScreen/StadiumScreen';
import FriendsScreen from './components/screens/FriendsScreen/FriendsScreen';
import QuestsScreen from './components/screens/QuestsScreen/QuestsScreen';
import styles from './App.module.css';
import './types';

const theme = createTheme({
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 56,
          position: 'fixed',
          bottom: 0,
          width: '100%',
          backgroundColor: 'var(--tg-theme-bg-color)',
          color: 'var(--tg-theme-text-color)',
        },
      },
    },
  },
});

const manifestUrl = 'https://simi129.github.io/TMA_NEW/tonconnect-manifest.json';

export const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const [vpResult, vpCleanup] = initViewport();
      const viewport = await vpResult;
      bindViewportCSSVars(viewport);

      const [tpResult, tpCleanup] = initThemeParams();
      bindThemeParamsCSSVars(tpResult);

      if (window.Telegram?.WebApp) {
        document.documentElement.style.setProperty(
          '--tg-viewport-stable-height',
          `${window.Telegram.WebApp.viewportStableHeight}px`
        );
        document.documentElement.style.setProperty(
          '--tg-bottom-safe-area',
          `${window.Telegram.WebApp.safeArea?.bottom || 0}px`
        );
      }

      setIsInitialized(true);

      return () => {
        vpCleanup();
        tpCleanup();
      };
    };

    initApp();
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <CoinProvider>
          <Router>
            <Box className={styles.appContainer}>
              <TopBar 
                level={1}
                progress={50}
                coinsPerHour={10}
              />
              <Box className={styles.contentContainer}>
                <Routes>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/upgrades" element={<UpgradesScreen />} />
                  <Route path="/stadium" element={<StadiumScreen />} />
                  <Route path="/friends" element={<FriendsScreen />} />
                  <Route path="/quests" element={<QuestsScreen />} />
                </Routes>
              </Box>
              <Box className={styles.bottomNavContainer}>
                <BottomNav />
              </Box>
            </Box>
          </Router>
        </CoinProvider>
      </TonConnectUIProvider>
    </ThemeProvider>
  );
}