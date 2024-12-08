export interface IUser {
  id: string;
  telegram_id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  name?: string;
  telegram_data?: any;
  client_code?: string;
  photo_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserMetaData {
  phone?: string;
  name?: string;
  telegram_connected?: boolean;
  updated_at?: string;
  [key: string]: any; // для других возможных полей
}

export interface TelegramData {
  id: number;
  first_name?: string;
  username?: string;
  language_code?: string;
  [key: string]: any;
}