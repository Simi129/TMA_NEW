import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CoinProvider } from './contexts/CoinContext';
import { LevelProvider } from './contexts/LevelContext';
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
import Onboarding from './components/Onboarding/Onboarding';
import styles from './App.module.css';
import { TelegramWebApps } from './types';

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
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isTelegramWebAppReady, setIsTelegramWebAppReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      console.log('Initializing app...');
      console.log('Telegram object:', window.Telegram);

      const [vpResult, vpCleanup] = initViewport();
      const viewport = await vpResult;
      bindViewportCSSVars(viewport);

      const [tpResult, tpCleanup] = initThemeParams();
      bindThemeParamsCSSVars(tpResult);

      if (window.Telegram?.WebApp) {
        console.log('Telegram WebApp found, initializing...');
        window.Telegram.WebApp.ready();
        const webApp = window.Telegram.WebApp;
        if ('viewportStableHeight' in webApp) {
          document.documentElement.style.setProperty(
            '--tg-viewport-stable-height',
            `${webApp.viewportStableHeight}px`
          );
        }
        if ('safeArea' in webApp && webApp.safeArea) {
          document.documentElement.style.setProperty(
            '--tg-bottom-safe-area',
            `${webApp.safeArea.bottom}px`
          );
        }
        setIsTelegramWebAppReady(true);
        console.log('Telegram WebApp initialized successfully');
      } else {
        console.warn('Telegram WebApp is not available');
        if (import.meta.env.DEV) {
          console.log('Development mode detected, using mock Telegram WebApp');
          const mockTelegram: TelegramWebApps = {
            WebApp: {
              initDataUnsafe: {
                user: {
                  id: 12345,
                  first_name: 'Test',
                  last_name: 'User',
                  username: 'testuser'
                }
              },
              sendData: (data: string) => { console.log('Mock sendData:', data); },
              openTelegramLink: (url: string) => { console.log('Mock openTelegramLink:', url); },
              platform: 'mock',
              ready: () => { console.log('Mock ready'); },
              showAlert: (message: string) => { console.log('Mock showAlert:', message); },
              showConfirm: (message: string) => Promise.resolve(true),
              openLink: (url: string) => { console.log('Mock openLink:', url); },
              viewportStableHeight: 700,
              safeArea: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              },
              MainButton: {
                text: 'Main Button',
                onClick: (callback: () => void) => { callback(); },
                show: () => { console.log('Mock MainButton show'); },
                hide: () => { console.log('Mock MainButton hide'); }
              }
            }
          };
          window.Telegram = mockTelegram;
          setIsTelegramWebAppReady(true);
        }
      }

      setIsInitialized(true);

      return () => {
        vpCleanup();
        tpCleanup();
      };
    };

    initApp();
  }, []);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  };

  if (!isInitialized) {
    return <div>Initializing...</div>;
  }

  if (!isTelegramWebAppReady) {
    return <div>Telegram WebApp is not available. Please open this app in Telegram.</div>;
  }

  if (!onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <CoinProvider>
          <LevelProvider>
            <Router>
              <Box className={styles.appContainer}>
                <TopBar />
                <Box className={styles.contentContainer}>
                  <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/upgrades" element={<UpgradesScreen />} />
                    <Route path="/stadium" element={<StadiumScreen />} />
                    <Route path="/friends" element={<FriendsScreen />} />
                    <Route path="/quests" element={<QuestsScreen />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
                <Box className={styles.bottomNavContainer}>
                  <BottomNav />
                </Box>
              </Box>
            </Router>
          </LevelProvider>
        </CoinProvider>
      </TonConnectUIProvider>
    </ThemeProvider>
  );
};

export default App;