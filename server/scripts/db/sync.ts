import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

async function syncDatabase() {
  try {
    // Создаем директорию для типов, если её нет
    const typesDir = join(process.cwd(), 'types');
    if (!existsSync(typesDir)) {
      mkdirSync(typesDir, { recursive: true });
    }

    // Проверяем наличие необходимых переменных окружения
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    // Создаем клиент Supabase с service_role ключом
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Генерируем типы
    console.log('Generating database types...');
    const types = `
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          telegram_id: number | null
          first_name: string | null
          last_name: string | null
          username: string | null
          language_code: string | null
          is_premium: boolean
          allows_write_to_pm: boolean
          added_to_attachment_menu: boolean
          photo_url: string | null
          client_code: string | null
          auth_code: string | null
          phone: string | null
          email: string | null
          role: 'admin' | 'client' | 'warehouse_manager' | 'order_manager'
          status: 'active' | 'blocked' | 'pending' | 'deleted'
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id?: number | null
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          language_code?: string | null
          is_premium?: boolean
          allows_write_to_pm?: boolean
          added_to_attachment_menu?: boolean
          photo_url?: string | null
          client_code?: string | null
          auth_code?: string | null
          phone?: string | null
          email?: string | null
          role?: 'admin' | 'client' | 'warehouse_manager' | 'order_manager'
          status?: 'active' | 'blocked' | 'pending' | 'deleted'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number | null
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          language_code?: string | null
          is_premium?: boolean
          allows_write_to_pm?: boolean
          added_to_attachment_menu?: boolean
          photo_url?: string | null
          client_code?: string | null
          auth_code?: string | null
          phone?: string | null
          email?: string | null
          role?: 'admin' | 'client' | 'warehouse_manager' | 'order_manager'
          status?: 'active' | 'blocked' | 'pending' | 'deleted'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      parcels: {
        Row: {
          id: string
          tracking_code: string
          user_id: string
          status: 'created' | 'accepted' | 'in_warehouse' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'lost'
          weight: number | null
          dimensions: Json | null
          description: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tracking_code: string
          user_id: string
          status?: 'created' | 'accepted' | 'in_warehouse' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'lost'
          weight?: number | null
          dimensions?: Json | null
          description?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tracking_code?: string
          user_id?: string
          status?: 'created' | 'accepted' | 'in_warehouse' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'lost'
          weight?: number | null
          dimensions?: Json | null
          description?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      user_role: 'admin' | 'client' | 'warehouse_manager' | 'order_manager'
      user_status: 'active' | 'blocked' | 'pending' | 'deleted'
      parcel_status: 'created' | 'accepted' | 'in_warehouse' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'lost'
    }
  }
}

// Вспомогательные типы
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
`;

    // Записываем типы в файл
    const typesFile = join(typesDir, 'database.types.ts');
    writeFileSync(typesFile, types, 'utf8');

    console.log('Database sync completed successfully');
  } catch (error) {
    console.error('Database sync failed:', error);
    process.exit(1);
  }
}

syncDatabase(); 