export interface User {
  id: string;
  telegram_id?: number;
  role: 'client' | 'admin' | 'warehouse_manager' | 'order_manager';
  full_name?: string | null;
  phone?: string | null;
  client_code?: string | null;
  username?: string | null;
  photo_url?: string | null;
  referral_code?: string | null;
  referral_balance?: number | null;
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