import { TelegramAuthResponse } from './user';

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramAuthResponse) => void;
  }
}

export {}; 