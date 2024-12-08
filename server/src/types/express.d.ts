import { User } from '@supabase/supabase-js'
import { JwtUser } from '../guards/jwt-auth.guard';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser
      headers: {
        authorization?: string
        [key: string]: string | undefined
      }
      body: any
    }
  }
}

export {}