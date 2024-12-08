import { User } from '@supabase/supabase-js'

declare global {
  namespace Express {
    interface Request {
      user?: User
      headers: {
        authorization?: string
        [key: string]: string | undefined
      }
      body: any
    }
  }
}

export {} 