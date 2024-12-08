import type { User } from '@supabase/supabase-js'

export interface TelegramUserMetadata {
  telegram_id?: number
  username?: string
  full_name?: string
}

export interface TelegramUser extends User {
  user_metadata: TelegramUserMetadata
}

export interface TelegramSession {
  user: TelegramUser
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithTelegram: (telegramData: any) => Promise<void>;
  signOut: () => Promise<void>;
  loginWithPassword: (phone: string, password: string) => Promise<void>;
}

// Простая заглушка для типа провайдера
declare global {
  namespace Supabase {
    type Provider = string
  }
}