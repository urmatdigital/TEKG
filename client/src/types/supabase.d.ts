import { Database } from './database.types'
import { Provider } from '@supabase/supabase-js'

declare module '@supabase/supabase-js' {
  interface OAuthProvider {
    TELEGRAM: 'telegram'
  }
}