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

// Простая заглушка для типа провайдера
declare global {
  namespace Supabase {
    type Provider = string
  }
}