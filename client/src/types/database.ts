export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          phone: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          client_code: string | null
          referral_balance: number
        }
        Insert: {
          id: string
          phone: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          client_code?: string | null
          referral_balance?: number
        }
        Update: {
          id?: string
          phone?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          client_code?: string | null
          referral_balance?: number
        }
      }
      shipments: {
        Row: {
          id: string
          tracking_number: string
          status: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled'
          sender_id: string
          recipient_name: string
          recipient_phone: string
          recipient_address: string
          weight: number
          type: 'document' | 'parcel' | 'cargo'
          created_at: string
          updated_at: string
          estimated_delivery: string | null
        }
        Insert: {
          id?: string
          tracking_number: string
          status?: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled'
          sender_id: string
          recipient_name: string
          recipient_phone: string
          recipient_address: string
          weight: number
          type: 'document' | 'parcel' | 'cargo'
          created_at?: string
          updated_at?: string
          estimated_delivery?: string | null
        }
        Update: {
          id?: string
          tracking_number?: string
          status?: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled'
          sender_id?: string
          recipient_name?: string
          recipient_phone?: string
          recipient_address?: string
          weight?: number
          type?: 'document' | 'parcel' | 'cargo'
          created_at?: string
          updated_at?: string
          estimated_delivery?: string | null
        }
      }
    }
  }
}
