export interface User {
  id: string;
  phone: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
  telegram_id?: string;
  telegram_username?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
  photo_url?: string;
  client_code?: string;
  referral_code?: string;
  referral_bonus?: number;
}

export interface TelegramSession {
  telegram_id: string;
  chat_id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  status?: number;
}
