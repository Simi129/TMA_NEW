interface TelegramWebApps {
  WebApp: {
    initDataUnsafe: {
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
      };
    };
    sendData(data: string): void;
    openTelegramLink(url: string): void;
    platform: string;
    // Добавляем недостающие методы
    ready(): void;
    showAlert(message: string): void;
    showConfirm(message: string): Promise<boolean>;
    openLink(url: string): void;
  };
}

declare global {
  interface Window {
    Telegram?: TelegramWebApps;
  }
}

export {};