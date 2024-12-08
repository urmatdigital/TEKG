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
          role: string
          full_name: string | null
          phone: string | null
          client_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          telegram_id?: number | null
          role?: string
          full_name?: string | null
          phone?: string | null
          client_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number | null
          role?: string
          full_name?: string | null
          phone?: string | null
          client_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 