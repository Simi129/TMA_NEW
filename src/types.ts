export interface TelegramWebApp {
  ready: () => void;
  initDataUnsafe: {
    user?: {
      id: number;
    };
  };
  showAlert: (message: string) => void;
  openLink: (url: string) => void;
  viewportStableHeight: number;
  safeArea?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}