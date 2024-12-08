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