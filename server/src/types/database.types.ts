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
      users: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          email: string | null
          first_name: string
          last_name: string | null
          username: string | null
          telegram_id: string
          role: 'USER' | 'ADMIN'
          phone: string | null
          address: string | null
          auth_code: string | null
          auth_code_expires_at: string | null
          avatar_url: string | null
          authCode: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          email?: string | null
          first_name: string
          last_name?: string | null
          username?: string | null
          telegram_id: string
          role?: 'USER' | 'ADMIN'
          phone?: string | null
          address?: string | null
          auth_code?: string | null
          auth_code_expires_at?: string | null
          avatar_url?: string | null
          authCode?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          email?: string | null
          first_name?: string
          last_name?: string | null
          username?: string | null
          telegram_id?: string
          role?: 'USER' | 'ADMIN'
          phone?: string | null
          address?: string | null
          auth_code?: string | null
          auth_code_expires_at?: string | null
          avatar_url?: string | null
          authCode?: string | null
        }
      }
      parcels: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          user_id: number
          description: string
          photo_url: string | null
          tracking_number: string | null
          status: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
          notes: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id: number
          description: string
          photo_url?: string | null
          tracking_number?: string | null
          status?: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
          notes?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id?: number
          description?: string
          photo_url?: string | null
          tracking_number?: string | null
          status?: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}