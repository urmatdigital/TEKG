import { Database } from './database.types';

export type User = Database['public']['Tables']['users']['Row'];

export interface UserResponse {
  user: User;
  isNew: boolean;
  authCode?: string;
}

export interface RegisterWithTelegramData {
  telegram_id: string;
  first_name: string;
  last_name?: string | null;
  username?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface UpdateUserProfileData {
  first_name?: string;
  last_name?: string | null;
  username?: string | null;
  phone?: string | null;
  address?: string | null;
  avatar_url?: string | null;
}
