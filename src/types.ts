export interface TelegramWebApps {
  WebApp: {
    initDataUnsafe: {
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
      };
    };
    sendData: (data: string) => void;
    openTelegramLink: (url: string) => void;
    platform: string;
    ready: () => void;
    showAlert: (message: string) => void;
    showConfirm: (message: string) => Promise<boolean>;
    openLink: (url: string) => void;
    viewportStableHeight: number;
    safeArea: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    MainButton: {
      text: string;
      onClick: (callback: () => void) => void;
      show: () => void;
      hide: () => void;
    };
  };
}

declare global {
  interface Window {
    Telegram?: TelegramWebApps;
  }
}