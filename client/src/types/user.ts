export interface User {
  id: string;
  telegram_id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  auth_code?: string;
  photo_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface TelegramAuthResponse {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
} 