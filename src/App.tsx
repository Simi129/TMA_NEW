import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CoinProvider } from './contexts/CoinContext';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import { retrieveLaunchParams, bindViewportCSSVars, initViewport, bindThemeParamsCSSVars, initThemeParams } from "@telegram-apps/sdk";
import { useAuth } from "./hooks/useAuth";
import TopBar from './components/TopBar/TopBar';
import BottomNav from './components/BottomNav/BottomNav';
import HomeScreen from './components/screens/HomeScreen/HomeScreen';
import UpgradesScreen from './components/screens/UpgradesScreen/UpgradesScreen';
import StadiumScreen from './components/screens/StadiumScreen/StadiumScreen';
import FriendsScreen from './components/screens/FriendsScreen/FriendsScreen';
import QuestsScreen from './components/screens/QuestsScreen/QuestsScreen';
import styles from './App.module.css';
import './types';


interface InitData {
  auth_date: number;
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    allows_write_to_pm?: boolean;
  };
  chat_instance?: string;
  chat_type?: string;
  start_param?: string;
  hash: string;
}

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

// Используем прямой URL манифеста с GitHub Pages
const manifestUrl = 'https://simi129.github.io/TMA_NEW/tonconnect-manifest.json';

export const App: React.FC = () => {
  const [initData, setInitData] = useState<InitData | null>(null);
  const auth = useAuth();

  useEffect(() => {
    const initApp = async () => {
      const [vpResult, vpCleanup] = initViewport();
      const viewport = await vpResult;
      bindViewportCSSVars(viewport);

      const [tpResult, tpCleanup] = initThemeParams();
      bindThemeParamsCSSVars(tpResult);

      const { initData } = retrieveLaunchParams();
      if (initData) {
        setInitData(initData as unknown as InitData);
      }

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

      return () => {
        vpCleanup();
        tpCleanup();
      };
    };

    initApp();
  }, []);

  if (!initData) {
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
                  <Route path="/" element={
                    <HomeScreen 
                      initData={initData}
                      authStatus={auth.user ? 'Authenticated' : 'Not authenticated'}
                      user={auth.user}
                    />
                  } />
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