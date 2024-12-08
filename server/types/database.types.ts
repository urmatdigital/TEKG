export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          telegram_id: number
          first_name: string
          last_name?: string
          username?: string
          phone?: string
          auth_code?: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          telegram_id: number
          first_name: string
          last_name?: string
          username?: string
          phone?: string
          auth_code?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          telegram_id?: number
          first_name?: string
          last_name?: string
          username?: string
          phone?: string
          auth_code?: string
          role?: string
          updated_at?: string
        }
      }
    }
  }
}
