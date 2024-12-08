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
          phone: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          id?: string
          phone: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          id?: string
          phone?: string
          updated_at?: string
          verified?: boolean
        }
      }
      temp_users: {
        Row: {
          id: string
          phone: string
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_phone: {
        Args: {
          user_id: string
          verification_code: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
