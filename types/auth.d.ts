import { ReactNode } from 'react';

export interface User {
  id: string;
  telegram_id?: string;
  telegram_username?: string;
  telegram_first_name?: string;
  telegram_last_name?: string;
  telegram_photo_url?: string;
  phone?: string;
  client_code: string;
  referral_code: string;
  referral_balance: number;
  cashback_balance: number;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
