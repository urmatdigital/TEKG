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
          id: string
          telegram_id: number
          first_name: string
          last_name: string | null
          username: string | null
          phone: string | null
          auth_code: string | null
          role: string
          created_at: string
          updated_at: string
          password_hash: string | null
          client_code: string
          avatar_url: string | null
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          telegram_id: number
          first_name: string
          last_name?: string | null
          username?: string | null
          phone?: string | null
          auth_code?: string | null
          role?: string
          created_at?: string
          updated_at?: string
          password_hash?: string | null
          client_code?: string
          avatar_url?: string | null
          status?: string
          notes?: string | null
        }
        Update: Partial<Insert>
      }
      parcels: {
        Row: {
          id: string
          tracking_code: string
          user_id: string
          status: ParcelStatus
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
          status?: ParcelStatus
          weight?: number | null
          dimensions?: Json | null
          description?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Insert>
      }
      parcel_status_history: {
        Row: {
          id: string
          parcel_id: string
          status: ParcelStatus
          location: string | null
          notes: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          parcel_id: string
          status: ParcelStatus
          location?: string | null
          notes?: string | null
          created_by: string
          created_at?: string
        }
        Update: Partial<Insert>
      }
    }
    Functions: {
      handle_updated_at: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type ParcelStatus = 
  | 'created'
  | 'accepted'
  | 'in_warehouse'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'returned'
  | 'lost';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
