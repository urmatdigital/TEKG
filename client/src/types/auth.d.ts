import { Provider } from '@supabase/supabase-js'

declare module '@supabase/supabase-js' {
  interface OAuthProvider extends Provider {
    TELEGRAM: 'telegram'
  }

  interface SignInWithOAuthCredentials {
    provider: OAuthProvider | 'telegram'
    options?: {
      redirectTo?: string
      scopes?: string
      queryParams?: {
        [key: string]: string
      }
    }
  }
} 