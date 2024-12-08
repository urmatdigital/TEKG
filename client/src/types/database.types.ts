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
          role: 'client' | 'admin' | 'warehouse_manager' | 'order_manager'
          full_name: string | null
          phone: string | null
          client_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          telegram_id?: number | null
          role?: 'client' | 'admin' | 'warehouse_manager' | 'order_manager'
          full_name?: string | null
          phone?: string | null
          client_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number | null
          role?: 'client' | 'admin' | 'warehouse_manager' | 'order_manager'
          full_name?: string | null
          phone?: string | null
          client_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      parcels: {
        Row: {
          id: string
          tracking_code: string
          user_id: string
          status: 'created' | 'in_transit' | 'delivered' | 'returned' | 'lost'
          weight: number | null
          dimensions: Json | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tracking_code: string
          user_id: string
          status?: 'created' | 'in_transit' | 'delivered' | 'returned' | 'lost'
          weight?: number | null
          dimensions?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tracking_code?: string
          user_id?: string
          status?: 'created' | 'in_transit' | 'delivered' | 'returned' | 'lost'
          weight?: number | null
          dimensions?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shipping_rates: {
        Row: {
          id: string
          name: string
          base_rate: number
          weight_rate: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          base_rate: number
          weight_rate: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          base_rate?: number
          weight_rate?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tracking_history: {
        Row: {
          id: string
          parcel_id: string
          status: 'created' | 'in_transit' | 'delivered' | 'returned' | 'lost'
          location: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          parcel_id: string
          status: 'created' | 'in_transit' | 'delivered' | 'returned' | 'lost'
          location?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          parcel_id?: string
          status?: 'created' | 'in_transit' | 'delivered' | 'returned' | 'lost'
          location?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}

export interface Profile {
  id: string
  telegram_id: number
  role: 'client' | 'admin' | 'warehouse_manager' | 'order_manager'
  full_name: string | null
  phone: string | null
  client_code: string | null
  username: string | null
  photo_url: string | null
  created_at: string
  updated_at: string
} 